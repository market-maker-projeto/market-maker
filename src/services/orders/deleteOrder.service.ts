import { AppError } from "../../errors/AppError";
import AppDataSource from "../../data-source";
import { Order } from "../../entities/order.entity";

export const deleteOrderService = async (id: string) => {
  if (!id) throw new AppError("Order id ivalid", 404);

  const ordersRepo = AppDataSource.getRepository(Order);

  const order = await ordersRepo.findOneBy({
    id: id,
  });

  if (!order) {
    throw new AppError("Order not found", 404);
  }

  await ordersRepo
    .createQueryBuilder()
    .softDelete()
    .where("id = :id", { id: id })
    .execute();

  return {};
};
