import { Order } from "./order.entity";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  JoinColumn,
  OneToMany,
} from "typeorm";

@Entity("client")
export class Table {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "integer", default: 4 })
  seats: number;

  @Column({ type: "boolean" })
  isActive: boolean;

  @Column({ type: "integer" })
  table_number: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Order, (order) => order.table)
  @JoinColumn()
  orders: Order[];
}
