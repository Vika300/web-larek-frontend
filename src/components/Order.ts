import { IOrderForm } from "../types";
import { ensureAllElements } from "../utils/utils";
import { IEvents } from "./base/events";
import { Form } from "./Form";


export class Order extends Form<IOrderForm> {
    protected _payButtons: HTMLButtonElement[];

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

        this._payButtons = ensureAllElements<HTMLButtonElement>('.button_alt', container);

        this._payButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.payment = button.name; 
                events.emit('order:changed', button)
            });
        })
    
    }

    set payment(name: string) {
        this._payButtons.forEach(button => {
        this.toggleClass(button, 'button_alt-active', button.name === name);
        });
    }

    set address(value: string) {
        (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
    }

}

export class Сontacts extends Form<IOrderForm> {
    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
    }
    set phone(value: string) {
        (this.container.elements.namedItem('phone') as HTMLInputElement).value = value;
    }
    set email(value: string) {
        (this.container.elements.namedItem('email') as HTMLInputElement).value = value;
    }
}