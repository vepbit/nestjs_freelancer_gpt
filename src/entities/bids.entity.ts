import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Bids {
  @PrimaryGeneratedColumn()
  project_id : number;

  @Column()
  time_submitted: number;

  @Column()
  milestone_percentage: number;

  @Column()
  period: number;

  @Column()
  amount: number;

  @Column()
  description: string;

  @Column()
  status: string;

}