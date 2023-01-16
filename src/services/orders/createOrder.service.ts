import { ProductsToOrder } from "./../../entities/producstToOrder.entity";
import { Order } from "./../../entities/order.entity";
import AppDataSource from "../../data-source";
import { Product } from "../../entities/product.entity";
import { Table } from "../../entities/table.entity";
import { User } from "../../entities/user.entity";
import { AppError } from "../../errors/AppError";
import {
  IOrderRequest,
  IOrderResponse,
} from "../../interfaces/orders.interface";

export const createOrderService = async ({
  user_id,
  table_id,
  client_name,
  products,
}): Promise<IOrderResponse> => {
  if (table_id.length != 36 || user_id.length != 36) {
    throw new AppError("Invalid Informations", 400);
  }

  products.forEach((product: any) => {
    if (product.id.length != 36) {
      throw new AppError("Product not found", 404);
    }
  });

  const tablesRepo = AppDataSource.getRepository(Table);
  const usersRepo = AppDataSource.getRepository(User);
  const productsRepo = AppDataSource.getRepository(Product);
  const ordersRepo = AppDataSource.getRepository(Order);
  const orders_productsRepo = AppDataSource.getRepository(ProductsToOrder);

  const userInfo = await usersRepo.findOneBy({
    id: user_id,
  });

  const tableInfo = await tablesRepo.findOneBy({
    id: table_id,
  });

  const foundProducts = await productsRepo.find();

  const productsInfo = products.map((elem: any) => {
    const productFilter = foundProducts.filter((product: any) => {
      if (elem.id === product.id) {
        return product;
      }
    });
    return productFilter[0];
  });

  const orderDatabase = {
    client_name: client_name,
    table: tableInfo,
    user: userInfo,
  };
  const orderCreate = ordersRepo.create(orderDatabase);
  const orderIdResponse = await ordersRepo.save(orderCreate);

  const foundOrderCreated = await ordersRepo.findOneBy({
    id: orderIdResponse.id,
  });

  productsInfo.forEach(async (product: any) => {
    const orderDatabasePivotSave = {
      order: foundOrderCreated,
      product: product,
    };
    const productToOrders = orders_productsRepo.create(orderDatabasePivotSave);
    await orders_productsRepo.save(productToOrders);
  });

  const orderSave = {
    order: foundOrderCreated,
  };

  const productToOrders = orders_productsRepo.create(orderSave);
  await orders_productsRepo.save(productToOrders);

  delete userInfo.password;

  const orderReponse = {
    id: foundOrderCreated.id,
    client_name: client_name,
    user: userInfo,
    table: tableInfo,
    products: productsInfo,
  };

  return orderReponse;
};
