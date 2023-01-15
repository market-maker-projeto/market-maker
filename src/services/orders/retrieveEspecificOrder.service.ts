export const retrieveEspecificOrderService = async () => {};
// const foundOrderCreatedId = foundOrderCreated.id;

//GET ALL
// const testReturn = await orders_productsRepo
//   .createQueryBuilder()
//   .innerJoinAndSelect("ProductsToOrder.order", "order")
//   .innerJoinAndSelect("order.user", "user")
//   .innerJoinAndSelect("order.table", "table")
//   .innerJoinAndSelect("ProductsToOrder.product", "product")
//   .getMany();

// GET SPECIFIC
// const teste2 = await orders_productsRepo
//   .createQueryBuilder()
//   .innerJoinAndMapMany("ProductsToOrder.order", "order", "orders")
//   .innerJoinAndSelect("orders.user", "user")
//   .innerJoinAndSelect("orders.table", "table")
//   .innerJoinAndSelect("ProductsToOrder.product", "product")
//   .where(`orders.id = '${foundOrderCreatedId}'`)
//   .getOne();

// console.log(teste2);
