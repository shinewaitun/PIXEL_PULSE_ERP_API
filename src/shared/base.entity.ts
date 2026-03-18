import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  BaseEntity as TypeOrmBaseEntity,
  ManyToOne,
  JoinColumn,
  Column,
} from 'typeorm';

export abstract class BaseEntity extends TypeOrmBaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt: Date;

  @ManyToOne('User', { nullable: true, eager: false })
  @JoinColumn({ name: 'created_by' })
  creator: any;

  @ManyToOne('User', { nullable: true, eager: false })
  @JoinColumn({ name: 'updated_by' })
  updater: any;

  @ManyToOne('User', { nullable: true, eager: false })
  @JoinColumn({ name: 'deleted_by' })
  deleter: any;

  static createEntity<T extends BaseEntity>(
    this: new () => T,
    props: Partial<T>,
    userId?: string,
  ): T {
    const entity = new this();
    Object.assign(entity, props);

    if (userId) {
      (entity as any).creator = { id: userId };
      (entity as any).updater = { id: userId };
    }

    return entity;
  }
}
