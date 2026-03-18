import { User } from 'src/modules/users/entities/user.entity';
import { UserRole } from 'src/modules/users/enums/user-role.enum';
import { setSeederFactory } from 'typeorm-extension';
import * as dotenv from 'dotenv';

dotenv.config();

export const UserFactory = setSeederFactory(User, (faker) => {
  const user = new User();
  user.username = process.env.ADMIN_USERNAME!;
  user.email = faker.internet.email();
  user.password = 'DefaultPassword123!';
  user.role = UserRole.Admin;
  user.isActive = true;
  return user;
});
