# Проектная работа "Веб-ларек"
Описание проекта
Проект "WEB-ларёк" реализует интернет-магазин с товарами для веб-разработчиков. Пользователь может посмотреть каталог товаров, добавить товары в корзину и сделать заказ.

Стек: HTML, SCSS, TS, Webpack

Архитектура: MVP

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Ключевые типы данных

```
interface IAction{
    onClick: (event: MouseEvent) => void;
}

interface IProduct {
    id: string;
    image: string;
    category: string;
    title: string;
    description: string;
    price: number|null;
}

interface ICard extends Partial<IProduct> {
	id: string;
    title: string;
    discription?: string;
    category?: string;
    price: number | null;
    image?: string;
    button?: string;
	index?: number;
}

interface IAppState {
    catalog: IProduct[];
    basket: string[];
    preview: string | null;
    order: IOrder | null;
    loading: boolean;
}

interface IOrderForm {
    email: string;
    phone: string;
    address: string;
    payment: string;
}

interface IOrder extends IOrderForm {
    items: string[];
    total: number;
}

interface IOrderResult {
    id: string;
}

interface IModalData {
    content: HTMLElement;
}

interface IBasket {
    items: HTMLElement[];
    total: number;
}

interface IFormState {
    valid: boolean;
    errors: string[];
}

interface IPage {
    counter: number;
    catalog: HTMLElement[];
    locked: boolean;
}

interface ISuccess {
	total: number;
}

interface ISuccessActions {
	onClick: () => void;
}

type FormErrors = Partial<Record<keyof IOrderForm, string>>;

type CatalogChangeEvent = {
    catalog: IProduct[]
}
```

## Базовый код

### Класс Api

Базовый класс для осущетсвления API-запросов к серверу.
Констуркор принимает аргументы:
- `baseUrl: string`
- `options: RequestInit`

Методы:
- `handleResponse(response: Response)` - обработчик запроса;
- `get(uri: string)` - отправляет GET-запрос к указанному uri;
- `post(uri: string, data: object, method: ApiPostMethods = 'POST')` - отправляет POST-запрос к указанному uri;

### Класс EventEmitter

Брокер событий.
Констуркор не принимает аргументов.

Методы:
- `on(eventName: EventName, callback: (event: T))` - установить обработчик на событие
- `off(eventName: EventName, callback: Subscriber)` - снять обработчик с события
- `emit(eventName: string, data?: T)` - инициировать событие с данными
- `onAll(callback: (event: EmitterEvent)` - установить обработчик на все события
- `offAll()` - снять обработчик со всех событий
- `trigger(eventName: string, context?: Partial<T>)` - cделать коллбек триггер, генерирующий событие при вызове

### Класс Model

Базовая модель
Констуркор принимает аргументы:
- `data: Partial<T>`
- `events: IEvents`

Методы:
- `emitChanges(event, payload)` - принимает название события и оповещает подписчиков об изменнеиях модели

### Класс Component

Определяет базовые методы для всех визуальных компонентов приложения
Констуркор принимает аргументы:
- `container: HTMLElement`

Методы:
- `toggleClass(element: HTMLElement, className: string, force?: boolean)` - Переключить класс
- `setText(element: HTMLElement, value: unknown)` - Установить текстовое содержимое
- `setDisabled(element: HTMLElement, state: boolean)` - Сменить статус блокировки
- `setHidden(element: HTMLElement)` - Скрыть элемент
- `setVisible(element: HTMLElement)` - Показать элемент
- `setImage(element: HTMLImageElement, src: string, alt?: string)` - Установить изображение с алтернативным текстом
- `render(data?: Partial<T>)` - Вернуть корневой DOM-элемент

## Компоненты модели данных (бизнес-логика)

### Класс AppState

Класс состояния приложения. Наследуется от класса Model

Поля:
```
catalog: Product[];
preview: string;
basket: ICard[];
order: IOrder;
formErrors: FormErrors;
```

Методы:
- `cleanBasket()` - Очистить корзину
- `cleanOrderState()` - Очистить данные заказа
- `addToBasket(item: IProduct)` - Добавить продукт в корзину
- `removeFromBasket(item: IProduct)` - Удалить продукт из корзины
- `isInBasket(item: IProduct)` - Проверить имеется ли данный продукт в корзине
- `getButtonText (item: IProduct)` - Получить текст кнопки Купить/Удалить
- `setCatalog(items: IProduct[])` - задать каталог
- `setPreview(item: IProduct)` - вызов модального окна карточки продукта
- `getTotalCost()` - получить общую стоимость товаров
- `setOrderField(field: keyof IOrderForm, value: string)` - установить значение поля заказа с последующей валидацией
- `setContactsField(field: keyof IOrderForm, value: string)` - установить значение поля контактов с последующей валидацией
- `validateOrder()` - валидация заполнения формы заказа
- `validateContacts()` - валидация заполнения формы контактов

### Класс Product

Класс состояния товара. Наследуется от класса Model

Поля:
```
id: string;
title: string;
price: number;
description: string;
image: string;
category: string;
```

## Компоненты представления

### Класс Basket

Отвечает за работу с корзиной. Наследуется от класса Component.

Конструктор принимает аргументы:

- `container: HTMLElement`
- `events: EventEmitter`

Методы:
- `set items(items: HTMLElement[])` - сеттер, задает список товаров в корзине
- `set total(total: number)` - сеттер, итоговую товаров в корзине

### Класс Card

Класс для создания карточки товара. Наследуется от класса Component.
Конструктор принимает такие аргументы:
- `protected container: HTMLElement`
- `actions?: IActions`

Методы:
- `set id(value: string)` - задать id
- `get id(): string` - получить id
- `set title(value: string)` задать название
- `set description(value: string)` - задать описание
- `set category(value: string)` - задать категорию
- `set price(value: number | null)` - задать цену
- `set image(value: string)` - задать изображение
- `set button(value: string)` - задать текст кнопки
- `set index(value: number)` - задать индекс

### Класс Form

Класс для за работы с формой заказа. Наследуется от класса Component.
Конструктор принимает аргументы:
- `container: HTMLFormElement`
- `events: IEvents`

Методы:
- `onInputChange(field: keyof T, value: string)` - обновить данные поля ввода
- `set valid(value: boolean)` - задать состояние валидности формы
- `set errors(value: string)` - задать текст ошибки
- `render(state: Partial<T> & IFormState)` - вернуть корневой DOM-элемент

### Класс Order
Класс реализует элемент заполнения формы заказа. Наследуется от класса Form
Конструктор принимает аргументы:
- `container: HTMLFormElement`
- `events: IEvents`

Методы:
- `set payment(name: string)` - задать способ оплаты
- `set address(value: string)` - задать адрес покупателя

### Класс Contacts
Класс реализует элемент заполнения формы контактов покупателя. Наследуется от класса Form
Конструктор принимает аргументы:
- `container: HTMLFormElement`
- `events: IEvents`

Методы:
- `set phone(value: string)` - задать телефон покупателя
- `set email(value: string)` - задать адрес электронной почты покупателя

### Класс Modal

Класс, для работы с модальными окнами. Наследуется от класса Component.
Конструктор принимает аргументы:
- `container: HTMLFormElement`
- `events: IEvents`

Методы:
- `set content(value: HTMLElement)` - задать контент в модальном окне
- `open()` - открыть модальное окно
- `close()` - закрыть модальное окно
- `render(data: IModalData)` - вернуть корневой DOM-элемент

### Класс Page

Класс для работы с главной страницей сайта. Наследуется от класса Component.
Конструктор принимает аргументы:
- `container: HTMLFormElement`
- `events: IEvents`

Методы:
- `set counter(value: number)` - задать счетчик товаров в корзине
- `set catalog(items: HTMLElement[])` - вывести карточки товаров внутри каталога
- `set locked(value: boolean)` - заблокировать прокрутку страницы (scroll)

### Класс Success

Класс, для отображения успешного оформления заказа. Наследуется от класса Component.
Конструктор принимает аргументы:
- `container: HTMLElement`
- `actions: ISuccessActions`

Методы:
- `set total(value: string)` - задать итоговую стоимость товара

## Компоненты коммуникации

### Класс LarekApi

Класс для взаимосдействия с сервером приложения. Наследуется от класса Api.
Конструктор принимает аргументы:
- `cdn: string`
- `baseUrl: string`
- `options?: RequestInit`

Методы:
- `getProductList()` - GET-запрос для получения списка товаров
- `getProductItem(id: string)` GET-запрос для получения информации о товаре
- `orderProducts(order: IOrder)` POST-запрос для отправки информации о заказе