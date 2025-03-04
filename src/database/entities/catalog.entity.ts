import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, Unique, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { Client } from './client.entity';

export enum CatalogVertical {
  FASHION = 'fashion',
  HOME = 'home',
  GENERAL = 'general',
}

@Entity()
@Unique(['client', 'name'])
export class Catalog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: CatalogVertical,
  })
  vertical: CatalogVertical;

  @Column({ default: false })
  primary: boolean;

  @Column('simple-array')
  locales: string[];

  @ManyToOne(() => Client, client => client.catalogs, { onDelete: 'CASCADE' })
  client: Client;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
