import AppDataSource from "../../data-source";
import { Order } from "../../entities/order.entity";
import { ProductsToOrder } from "../../entities/producstToOrder.entity";
import { Product } from "../../entities/product.entity";
import { User } from "../../entities/user.entity";

export const retrieveEspecificOrderService = async (id: any) => {
  const orders_productsRepo = AppDataSource.getRepository(ProductsToOrder);
  const ordersRepo = AppDataSource.getRepository(Order);

  const orderResponse = await orders_productsRepo
    .createQueryBuilder()
    .innerJoinAndMapMany(
      "ProductsToOrder.order",
      "order",
      "orders",
      `orders.id = '${id}'`
    )
    .innerJoinAndSelect("orders.user", "user")
    .innerJoinAndSelect("orders.table", "table")
    .innerJoinAndSelect("ProductsToOrder.product", "product")
    .where(`orders.id = '${id}'`)
    .getMany();

  // const orderResponseTest = await orders_productsRepo
  //   .createQueryBuilder("order_products")
  //   .innerJoinAndSelect(Order, "orders", "orders.id = order_products.orderId")
  //   .innerJoinAndSelect(User, "users", "orders.userId = users.id")
  //   .innerJoinAndSelect(
  //     Product,
  //     "products",
  //     "products.id = order_products.productId"
  //   )
  //   .where("orders.id = :orderId", { orderId: id })
  //   .getMany();

  // const testeFunction = async () => {
  //   const returning = orderResponseTest.map(async (products) => {
  //     const productsReturn = await orders_productsRepo.find({
  //       where: {
  //         id: products.id,
  //       },
  //       relations: {
  //         product: true,
  //       },
  //     });
  //     return productsReturn;
  //   });
  //   return returning;
  // };

  // console.log(returning);
  // const;

  return orderResponse;
};
