import { Order } from "./order.entity";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
  DeleteDateColumn,
  OneToMany,
} from "typeorm";
import { hashSync } from "bcryptjs";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ length: 120, type: "varchar" })
  username: string;

  @Column({ length: 120, type: "varchar" })
  password: string;

  @Column({ type: "boolean" })
  isAdm: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  encryptPassword() {
    this.password = hashSync(this.password, 10);
  }

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];
}
