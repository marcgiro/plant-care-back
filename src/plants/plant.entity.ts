import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Plant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  variety: string;

  @Column()
  health: number;

  @Column()
  isAlive: boolean;

  @Column()
  lastWatered: Date;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;
}
