import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, FindOptionsWhere, ILike, Not, Repository } from 'typeorm';
import { Subscription } from './entities/subscription.entity';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
  ) {}

  async create(
    createSubscriptionDto: CreateSubscriptionDto,
  ): Promise<Subscription> {
    const subscription = this.subscriptionRepository.create(
      createSubscriptionDto,
    );
    return await this.subscriptionRepository.save(subscription);
  }

  async findAll(
    currentSubscriptionId: string,
    search?: string,
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'createdAt',
    sortOrder: 'ASC' | 'DESC' = 'DESC',
  ) {
    const skip = (page - 1) * limit;

    const excludeSelf = Not(Equal(currentSubscriptionId));

    let whereCondition: any;

    if (search) {
      whereCondition = [
        {
          id: excludeSelf,
          name: ILike(`%${search}%`),
        },
        {
          id: excludeSelf,
          number: ILike(`%${search}%`),
        },
      ];
    } else {
      whereCondition = {};
    }

    const [subscriptions, totalCount] =
      await this.subscriptionRepository.findAndCount({
        where: whereCondition as FindOptionsWhere<Subscription>,
        take: limit,
        skip: skip,
        order: {
          [sortBy]: sortOrder,
        },
      });

    const totalPages = Math.ceil(totalCount / limit);

    return {
      data: subscriptions,
      meta: {
        totalCount,
        totalPages,
        currentPage: page,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  async findOne(id: string): Promise<Subscription> {
    const subscription = await this.subscriptionRepository.findOne({
      where: { id },
    });
    if (!subscription) {
      throw new NotFoundException(`Subscription with ID ${id} not found`);
    }
    return subscription;
  }

  async update(
    id: string,
    updateSubscriptionDto: UpdateSubscriptionDto,
  ): Promise<Subscription> {
    const subscription = await this.findOne(id);
    Object.assign(subscription, updateSubscriptionDto);
    return await this.subscriptionRepository.save(subscription);
  }

  async toggleStatus(id: string): Promise<Subscription> {
    const subscription = await this.findOne(id);
    subscription.isActive = !subscription.isActive;
    return await this.subscriptionRepository.save(subscription);
  }

  async remove(id: string): Promise<void> {
    const subscription = await this.findOne(id);
    await this.subscriptionRepository.softRemove(subscription);
  }
}
