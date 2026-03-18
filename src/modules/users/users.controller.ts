import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { ParseArrayQueryPipe } from 'src/common/pipes/parse-array-query.pipe';
import { StrictUUIDPipe } from 'src/common/pipes/strict-uuid.pipe';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ResponseMessage('Users created successful.')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ResponseMessage('Users retrieved successful.')
  findAll(
    @Req() req: any,
    @Query('search') search: string,
    @Query('role', ParseArrayQueryPipe) roles: string[],
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('sortBy') sortBy: string,
    @Query('sortOrder', new DefaultValuePipe('DESC')) sortOrder: 'ASC' | 'DESC',
  ) {
    return this.usersService.findAll(
      req.user.sub,
      search,
      roles,
      page,
      limit,
      sortBy,
      sortOrder,
    );
  }

  @Get(':id')
  @ResponseMessage('User retrieved successful.')
  findOne(@Param('id', StrictUUIDPipe) id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('User updated successful.')
  update(
    @Param('id', StrictUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Patch('toggle-status/:id')
  @ResponseMessage('User status updated successful.')
  toggleStatus(@Param('id', StrictUUIDPipe) id: string) {
    return this.usersService.toggleStatus(id);
  }

  @Delete(':id')
  @ResponseMessage('User removed successful.')
  remove(@Param('id', StrictUUIDPipe) id: string) {
    return this.usersService.remove(id);
  }
}
