import { Component } from "./base/component";
import { ensureElement } from "../utils/utils";
import { ICard, IAction } from "../types";

export class Card extends Component<ICard> {
	protected _title: HTMLElement;
	protected _description?: HTMLElement;
	protected _category: HTMLElement;
	protected _price: HTMLElement;
    protected _image: HTMLImageElement;
    protected _button: HTMLButtonElement;
    protected _index?: HTMLElement;

	constructor(protected blockName: string, container: HTMLElement, actions?: IAction) {
		super(container);

		this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
        this._description = container.querySelector(`.${blockName}__description`);
		this._category = container.querySelector(`.${blockName}__category`);
        this._price = ensureElement<HTMLElement>(`.${blockName}__price`, container);
		this._image = container.querySelector(`.${blockName}__image`);
		this._button = container.querySelector(`.${blockName}__button`);
        this._index = container.querySelector(`.basket__item-index`);

		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
	}

	set id(value: string) {
		this.container.dataset.id = value;
	}

	get id(): string {
		return this.container.dataset.id || '';
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	set description(value: string) {
		this.setText(this._description, value);
	}

	set category(value: string) {
        this.setText(this._category, value);
        switch(value) {
            case 'софт-скил':
                this._category.classList.add('card__category_soft');
                break
            case 'другое':
                this._category.classList.add('card__category_other');
                break
            case 'дополнительное':
                this._category.classList.add('card__category_additional')
                break
            case 'кнопка':
                this._category.classList.add('card__category_button');
                break
            case 'хард-скил':
                this._category.classList.add('card__category_hard');
                break
        }
	}

	set price(value: number | null) {
		if (value) {
			this.setText(this._price, `${value} синапсов`);
		} else {
			this.setText(this._price, `Бесценно`);
			this.setDisabled(this._button, true);
		}
	}

	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

    set button(value: string) {
		this.setText(this._button, value);
	}

    set index(value: number) {
		this.setText(this._index, String(value));
	}
}