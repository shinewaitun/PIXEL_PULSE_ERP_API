import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../shared/base.entity';
import { Subscription } from '../../subscriptions/entities/subscription.entity';

@Entity('companies')
export class Company extends BaseEntity {
  @ManyToOne(() => Subscription, { nullable: false, eager: false })
  @JoinColumn({ name: 'subscription_id' })
  subscription: Subscription;

  @Column()
  number: string;

  @Column()
  img_url: string;

  @Column()
  name: string;

  @Column()
  contact_info: string;

  @Column({ nullable: true })
  address: string;

  @Column({ type: 'timestamp', nullable: true })
  subscription_date: Date;

  @Column({ type: 'timestamp', nullable: true })
  expiry_date: Date;

  @Column({ type: 'json', nullable: true })
  setting: Record<string, any>;
}
