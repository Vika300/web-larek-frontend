export interface IAction{
    onClick: (event: MouseEvent) => void;
}

export interface IProduct {
    id: string;
    image: string;
    category: string;
    title: string;
    description: string;
    price: number|null;
}

export interface ICard extends Partial<IProduct> {
	id: string;
    title: string;
    discription?: string;
    category?: string;
    price: number | null;
    image?: string;
    button?: string;
	index?: number;
}

export interface IAppState {
    catalog: IProduct[];
    basket: string[];
    preview: string | null;
    order: IOrder | null;
    loading: boolean;
}

export interface IOrderForm {
    email: string;
    phone: string;
    address: string;
    payment: string;
}

export interface IOrder extends IOrderForm {
    items: string[];
    total: number;
}

export interface IOrderResult {
    id: string;
}

export interface IModalData {
    content: HTMLElement;
}

export interface IBasket {
    items: HTMLElement[];
    total: number;
}

export interface IFormState {
    valid: boolean;
    errors: string[];
}

export interface IPage {
    counter: number;
    catalog: HTMLElement[];
    locked: boolean;
}

export interface ISuccess {
	total: number;
}

export interface ISuccessActions {
	onClick: () => void;
}

export type FormErrors = Partial<Record<keyof IOrderForm, string>>;

export type CatalogChangeEvent = {
    catalog: IProduct[]
}
