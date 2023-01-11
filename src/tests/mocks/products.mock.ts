import { IValidProduct, IMockedProduct } from './../../interfaces/products.interface';



export const createProduct: IValidProduct = {
    name: "Cerveja Long Neck",
    categoryId: "",
    price: 8.99,
    in_stock: true
}
export const mockedProduct: IMockedProduct = {
    name: "Cerveja Long neck",
    categoryId: "",
    price: 8.99,
    in_stock:true,
    id: ""
}
export const invalidProduct: IMockedProduct = {
    name: "",
    categoryId: "",
    price: 8.99,
    in_stock: true,
    id: ""
}