import { IOrder, IOrderForm, IAppState, FormErrors, ICard, IProduct } from "../types"; 
import { Model } from "./base/model";

export class Product extends Model<IProduct> {
	id: string;
	title: string;
	price: number;
	description: string;
	image: string;
	category: string;
}

export class AppState extends Model<IAppState> {
    catalog: Product[];
    preview: string;
    order: IOrder = {
        address: '',
        payment: '',
        email: '',
        phone: '',
        items: [],
        total: 0,
    };
    formErrors: FormErrors = {};

    cleanBasket() {
        this.order.items = [];
        this.emitChanges('basket:changed', this.order.items);
    }

    cleanOrderState() {
        this.order = {
            address: '',
            payment: '',
            email: '',
            phone: '',
            items: [],
            total: 0,
        };
    }

    addToBasket(item: IProduct){
        this.order.items.push(item.id);
        this.emitChanges('basket:changed', this.order.items);
    };

    removeFromBasket(item: IProduct){
        this.order.items = this.order.items.filter((productId) => productId !== item.id);
        this.emitChanges('basket:changed', this.order.items);
    };

    isInBasket(item: IProduct) {
		return this.order.items.some((it) => it === item.id);
	}

    getButtonText (item: IProduct) {
        if (this.isInBasket(item)) {
            return 'Удалить из корзины';
        } else {
            return 'Купить';
        }
    }

    setCatalog(items: IProduct[]) {
        this.catalog = items.map((item) => new Product(item, this.events));
        this.emitChanges('items:changed', { catalog: this.catalog });
    }

    setPreview(item: IProduct) {
        this.preview = item.id;
        this.emitChanges('preview:changed', item);
    }

    getTotalCost() {
        return this.order.items.reduce((a, c) => a + this.catalog.find(it => it.id === c).price, 0)
    }

    setOrderField(field: keyof IOrderForm, value: string) {
        this.order[field] = value;
        this.validateOrder();
    }

    setContactsField(field: keyof IOrderForm, value: string) {
        this.order[field] = value;
        this.validateContacts()
    }

    validateOrder() {
        const errors: typeof this.formErrors = {};
        
        if (!this.order.address) {
            errors.address = 'Необходимо указать адресс';
        }
        if (!this.order.payment) {
			errors.payment = 'Выберите способ оплаты!';
		}
        this.formErrors = errors;
        this.events.emit('formErrors:changed', this.formErrors);
        return Object.keys(errors).length === 0;
    }

    validateContacts() {
        const errors: typeof this.formErrors = {};
        if (!this.order.email) {
            errors.email = 'Необходимо указать email';
        }
        if (!this.order.phone) {
            errors.phone = 'Необходимо указать телефон';
        }
        
        this.formErrors = errors;
        this.events.emit('formErrors:changed', this.formErrors);
        return Object.keys(errors).length === 0;
    }
}
