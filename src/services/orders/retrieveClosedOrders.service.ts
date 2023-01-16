import AppDataSource from "../../data-source";
import { Order } from "../../entities/order.entity";
import { ProductsToOrder } from "../../entities/producstToOrder.entity";
import { AppError } from "../../errors/AppError";

export const retrieveClosedOrdersService = async (id: any) => {
  const order_productsRepo = AppDataSource.getRepository(Order);

  const orders = await order_productsRepo.findOne({
    where: {
      id: id,
    },
    withDeleted: true,
  });

  if (!orders.deletedAt) {
    throw new AppError("Order not closed yet", 404);
  }

  return orders;
};
