import { ProductsToOrder } from "./../../entities/producstToOrder.entity";
import { Order } from "./../../entities/order.entity";
import AppDataSource from "../../data-source";
import { Product } from "../../entities/product.entity";
import { Table } from "../../entities/table.entity";
import { User } from "../../entities/user.entity";
import { AppError } from "../../errors/AppError";
import { IOrderRequest } from "../../interfaces/orders.interface";

export const createOrderService = async ({
  user_id,
  table_id,
  client_name,
  products,
}: IOrderRequest) => {
  if (table_id.length != 36 || user_id.length != 36) {
    throw new AppError("Invalid Informations", 400);
  }

  products.forEach((product) => {
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

  const productsInfo = foundProducts.filter((elem) => {
    const product = products.filter((product) => {
      if (elem.id == product.id) {
        return product;
      }
    });
    return product;
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

  productsInfo.forEach(async (product) => {
    const orderDatabasePivotSave = {
      order: foundOrderCreated,
      product: product,
    };
    const productToOrders = orders_productsRepo.create(orderDatabasePivotSave);
    await orders_productsRepo.save(productToOrders);
  });

  const orderReponse = {
    id: foundOrderCreated.id,
    client_name: client_name,
    user: userInfo,
    table: tableInfo,
    products: productsInfo,
  };

  return orderReponse;
};
