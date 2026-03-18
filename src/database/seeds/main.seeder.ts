import * as dotenv from 'dotenv';

import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { User } from 'src/modules/users/entities/user.entity';
import { UserRole } from 'src/modules/users/enums/user-role.enum';

dotenv.config();

export default class MainSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    const userFactory = factoryManager.get(User);

    if (
      !process.env.ADMIN_USERNAME ||
      !process.env.ADMIN_PASSWORD ||
      !process.env.ADMIN_EMAIL
    ) {
      throw new Error('❌ Missing Admin configuration in .env file');
    }

    console.log('🌱 Manually seeding Admin user...');

    await userFactory.save({
      username: process.env.ADMIN_USERNAME,
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      role: UserRole.Admin,
    });

    console.log(`✅ Admin created: ${process.env.ADMIN_EMAIL}`);
  }
}
