import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Dialogflow {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  id_project: number;

  @Column()
  query: string;

  @Column()
  name_full: string;

  @Column()
  name: string;

  @Column()
  answer: string;

  @Column()
  confidence: string;

  @Column()
  validity: string;

  @Column()
  answer_updated: string;
  
  @Column()
  date_creation: Date;

  @Column()
  date_updated: Date;

  @Column()
  id_list: number;
}