import {  IMockedCategory } from './categories.interface';
export interface IValidProduct{
    categoryId: string;
    name: string;
    price: number;
    in_stock: boolean;
}
export interface IMockedProduct{
    categoryId: string;
    name: string;
    price: number;
    in_stock: boolean;
    id: string;
}