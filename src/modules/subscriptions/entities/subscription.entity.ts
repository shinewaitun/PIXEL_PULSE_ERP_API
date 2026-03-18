import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../shared/base.entity';

@Entity('subscriptions')
export class Subscription extends BaseEntity {
  @Column()
  name: string;

  @Column()
  number: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'int' })
  duration: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  discount: number;
}
