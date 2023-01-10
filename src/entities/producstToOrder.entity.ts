import { Product } from "./product.entity";
import { Order } from "./order.entity";
import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";

@Entity("order_products")
export class ProductsToOrder {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Order, (order) => order.productsToOrder)
  @JoinColumn()
  order: Order;

  @ManyToOne(() => Product, (product) => product.productsToOrder)
  @JoinColumn()
  product: Product;
}
