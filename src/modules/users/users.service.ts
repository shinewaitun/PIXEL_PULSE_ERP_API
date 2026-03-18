import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, FindOptionsWhere, ILike, In, Not, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    return await this.userRepository.save(user);
  }

  async findAll(
    currentUserId: string,
    search?: string,
    roles?: string[],
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'createdAt',
    sortOrder: 'ASC' | 'DESC' = 'DESC',
  ) {
    const skip = (page - 1) * limit;
    const roleFilter = roles && roles.length > 0 ? In(roles) : null;

    const excludeSelf = Not(Equal(currentUserId));

    let whereCondition: any;

    if (search) {
      whereCondition = [
        {
          id: excludeSelf,
          username: ILike(`%${search}%`),
          ...(roleFilter && { role: roleFilter }),
        },
        {
          id: excludeSelf,
          email: ILike(`%${search}%`),
          ...(roleFilter && { role: roleFilter }),
        },
      ];
    } else {
      whereCondition = roleFilter ? { id: excludeSelf, role: roleFilter } : {};
    }

    const [users, totalCount] = await this.userRepository.findAndCount({
      where: whereCondition as FindOptionsWhere<User>,
      take: limit,
      skip: skip,
      order: {
        [sortBy]: sortOrder,
      },
    });

    const totalPages = Math.ceil(totalCount / limit);

    return {
      data: users,
      meta: {
        totalCount,
        totalPages,
        currentPage: page,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    Object.assign(user, updateUserDto);
    return await this.userRepository.save(user);
  }

  async toggleStatus(id: string): Promise<User> {
    const user = await this.findOne(id);
    user.isActive = !user.isActive;
    return await this.userRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.softRemove(user);
  }
}
