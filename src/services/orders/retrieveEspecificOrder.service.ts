import AppDataSource from "../../data-source";
import { Order } from "../../entities/order.entity";
export const retrieveEspecificOrderService = async (id: any) => {
  const ordersRepo = AppDataSource.getRepository(Order);

  const findOrder = await ordersRepo.findOne({
    where: {
      id: id,
    },
  });

  delete findOrder.user.password;

  delete Object.assign(findOrder, {
    ["products"]: findOrder["productsToOrder"],
  })["productsToOrder"];

  return findOrder;
};
