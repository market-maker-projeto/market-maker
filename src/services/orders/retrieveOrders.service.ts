import { ProductsToOrder } from "../../entities/producstToOrder.entity";
import AppDataSource from "../../data-source";

export const retrieveOrdersService = async () => {
  const orders_productsRepo = AppDataSource.getRepository(ProductsToOrder);

  const ordersResponse = await orders_productsRepo
    .createQueryBuilder()
    .innerJoinAndSelect("ProductsToOrder.order", "order")
    .innerJoinAndSelect("order.user", "user")
    .innerJoinAndSelect("order.table", "table")
    .innerJoinAndSelect("ProductsToOrder.product", "product")
    .getMany();

  return ordersResponse;
};
