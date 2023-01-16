import AppDataSource from "../../data-source";
import { Order } from "../../entities/order.entity";

export const retrieveOrdersService = async () => {
  const ordersRepo = AppDataSource.getRepository(Order);

  const findOrders = await ordersRepo.find();

  return findOrders;
};
