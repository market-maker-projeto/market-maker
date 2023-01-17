import AppDataSource from "../../data-source";
import { Order } from "../../entities/order.entity";
import { retrieveOrdersResponseSchema } from "../../schemas/orders.schemas";

export const retrieveOrdersService = async () => {
  const ordersRepo = AppDataSource.getRepository(Order);

  const findOrders = await ordersRepo.find();

  const response = retrieveOrdersResponseSchema.validate(findOrders, {
    stripUnknown: true,
  });

  return response;
};
