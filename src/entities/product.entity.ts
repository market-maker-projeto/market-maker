import { ProductsToOrder } from "./producstToOrder.entity";
import { Category } from "./category.entity";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";

@Entity()
export class Product {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ length: 120, type: "varchar" })
  name: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  price: string;

  @Column({ type: "boolean" })
  in_stock: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => Category, (category) => category.product)
  @JoinColumn()
  category: Category;

  @OneToMany(
    () => ProductsToOrder,
    (productsToOrder) => productsToOrder.product
  )
  productsToOrder: ProductsToOrder;
}
