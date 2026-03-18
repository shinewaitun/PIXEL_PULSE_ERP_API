import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm';
import { UserRole } from '../enums/user-role.enum';
import { UserSubscription } from '../enums/user-subscription.enum';
import { Exclude } from 'class-transformer';
import { BaseEntity } from '../../../shared/base.entity';
import { PasswordUtil } from '../../../common/utils';

@Entity('users')
export class User extends BaseEntity {
  @Exclude()
  @Column({ unique: true, nullable: true })
  apiKey: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  phoneNumber: string;

  @Exclude()
  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: ['ACTIVE', 'INACTIVE'],
    default: 'ACTIVE',
  })
  status: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.Staff as string,
  })
  role: UserRole;

  @Column({
    type: 'enum',
    enum: UserSubscription,
    default: UserSubscription.Unpaid,
  })
  subscription: UserSubscription;

  @BeforeInsert()
  @BeforeUpdate()
  hashPassword() {
    if (this.password && !this.password.includes(':')) {
      this.password = PasswordUtil.hashPassword(this.password);
    }
  }
}
