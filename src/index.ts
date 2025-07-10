import './scss/styles.scss';
import { cloneTemplate, ensureElement } from './utils/utils';
import { EventEmitter } from './components/base/events';
import { API_URL, CDN_URL } from './utils/constants';
import { larekApi } from './components/LarekAPI';
import { AppState } from './components/AppData';
import { Page } from './components/Page';
import { Card } from './components/Card';
import { Modal } from './components/Modal';
import { Basket } from './components/Basket';
import { Order, Сontacts } from './components/Order';
import { IOrderForm, IOrder, ICard, IProduct, CatalogChangeEvent} from './types';
import { Success } from './components/Success';

const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');

const events = new EventEmitter();
const api = new larekApi(CDN_URL, API_URL);
const appData = new AppState({}, events);
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events)
const basket = new Basket(cloneTemplate<HTMLTemplateElement>(basketTemplate), events);
const order = new Order(cloneTemplate<HTMLFormElement>(orderTemplate), events);
const contacts = new Сontacts(cloneTemplate<HTMLFormElement>(contactsTemplate), events);
const success = new Success(cloneTemplate(successTemplate), {
	onClick: () => {
		modal.close();
	},
});

events.onAll(({ eventName, data }) => {
    console.log(eventName, data);
  })


events.on<CatalogChangeEvent>('items:changed', () => {
    page.catalog = appData.catalog.map((item) => {
        const card = new Card('card', cloneTemplate(cardCatalogTemplate), {
            onClick: () => {
                events.emit('card:selected', item);
            },
        });
        return card.render({
            id: item.id,
            title: item.title,
            image: item.image,
            price: item.price,
            category: item.category,
        })
    });
});

events.on('card:selected', (item: IProduct) => {
    appData.setPreview(item);
});

events.on('preview:changed', (item: IProduct) => {
    const card = new Card('card', cloneTemplate(cardPreviewTemplate), {
        onClick: () => {
            events.emit('item:toggle', item);
            modal.close();
        },
    });
    modal.render({
        content: card.render({
            id: item.id,
            title: item.title,
            image: item.image,
            discription: item.description,
            price: item.price,
            category: item.category,
            button: appData.getButtonText(item),
        }),
    });
});

events.on('basket:open', () => {
    modal.render({
        content: basket.render(),
    });
});

events.on('basket:changed', () => {
    page.counter = appData.order.items.length;
    basket.items = appData.order.items.map((id) => {
		const item = appData.catalog.find((item) => item.id === id);
		const itemIndex = appData.order.items.indexOf(id) + 1;
		const card = new Card('card', cloneTemplate(cardBasketTemplate), {
			onClick: () => {
				events.emit('item:toggle', item);
			},
		});
		return card.render({
            index: itemIndex,
			title: item.title,
			price: item.price,
		});
	});
	basket.total = appData.getTotalCost();
});

events.on('item:toggle', (item: IProduct) => {
    if (!appData.isInBasket(item)) {
        appData.addToBasket(item);
    } else {
        appData.removeFromBasket(item);
    }
});

events.on('order:open', () => {
	appData.order.total = appData.getTotalCost();
	modal.render({
		content: order.render({
			payment: '',
			address: '',
			valid: false,
			errors: [],
		}),
	});
});

events.on('order:changed', (button: HTMLButtonElement) => {
    appData.setOrderField('payment', button.name);
});

events.on(/^order\..*:change/, (data: { field: keyof IOrderForm; value: string }) => {
    appData.setOrderField(data.field, data.value);
}
);

events.on('order:submit', () => {
    modal.render({
        content: contacts.render({
            phone: '',
            email: '',
            valid: false,
            errors: [],
        }),
    });
});

events.on(/^contacts\..*:change/, (data: { field: keyof IOrderForm; value: string }) => {
    appData.setContactsField(data.field, data.value);
}
);

events.on('contacts:submit', () => {
    api.orderProducts(appData.order)
    .then((res) => {
        const totalCost = appData.getTotalCost()
        appData.cleanBasket();
        appData.cleanOrderState();
        events.emit('basket:changed');
        modal.render({ content: success.render({ total: totalCost }) });
    })
    .catch((err) => {
        console.error(err);
    });
});

events.on('formErrors:changed', (errors: Partial<IOrder>) => {
    const { email, phone, address, payment } = errors;
    order.valid = !payment && !address;
    order.errors = Object.values({ payment, address })
    .filter((i) => !!i)
    .join('; ');

    contacts.valid = !email && !phone;
    contacts.errors = Object.values({ email, phone })
    .filter((i) => !!i)
    .join('; ');
});

events.on('modal:open', () => {
    page.locked = true;
});

events.on('modal:close', () => {
    page.locked = false;
});

api.getProductList()
  .then(appData.setCatalog.bind(appData))
  .catch(err => {
    console.error(err);
});