import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class List {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  requestid: number;

  @Column()
  url: string;

  @Column()
  title: string;

  @Column()
  preview_description: string;

  @Column()
  tags: string;

  @Column()
  country: string;

  @Column()
  timezone: string;

  @Column()
  timezone_offset: string;
  
  @Column()
  assisted: string;

  @Column()
  username: string;

  @Column()
  verifiedverifiedemail: number;

  @Column()
  verifiedpayment: number;

  @Column()
  currency: string;

  @Column()
  projectlanguage: string;
  
  @Column()
  userid: number;

  @Column()
  verified_ident: number;

  @Column()
  made_payment: number;

  @Column()
  display_name: string;

  @Column()
  public_name: string;

  @Column()
  status: string;

  @Column()
  budget_min: number;

  @Column()
  budget_max: number;

  @Column()
  project_type: string;

  @Column()
  userlanguage: string;

  @Column()
  project_added: Date;

  @Column()
  projectid: number;

  @Column()
  bidstatus: string;
  
  @Column()
  tagsid: string;

  @Column()
  full_description: string;

  @Column()
  propose_status: string;

  @Column()
  propose_text: string;

  @Column()
  propose_period: string;

  @Column()
  frontend_project_status: string;

  @Column()
  publishtime: string;

  @Column()
  time_updated: number;


  @Column()
  updated_by_script: string;

  @Column()
  propose_amount: string;

  @Column()
  propose_accept_time: string;

  @Column()
  recruiter: string;
}