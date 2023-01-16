import { ProductsToOrder } from "./producstToOrder.entity";
import { User } from "./user.entity";
import { Table } from "./table.entity";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";

@Entity()
export class Order {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", nullable: true })
  client_name: string;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => Table, (table) => table.orders, { eager: true })
  @JoinColumn()
  table: Table;

  @ManyToOne(() => User, (user) => user.orders, { eager: true })
  @JoinColumn()
  user: User;

  @OneToMany(
    () => ProductsToOrder,
    (productsToOrder) => productsToOrder.order,
    { eager: true }
  )
  productsToOrder: ProductsToOrder;
}
