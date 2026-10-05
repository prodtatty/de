// Блюда с https://yandex.com/profile/190977006511 — заполните по образцу.
export type Dish = { name: string; price: string; description?: string }
export type MenuGroup = { title: string; items: Dish[] }

export const MENU: MenuGroup[] = [
  // { title: 'Кофе', items: [{ name: 'Капучино', price: '250 ₽', description: '300 мл' }] },
]
