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
import { SubscriptionsService } from './subscriptions.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { StrictUUIDPipe } from 'src/common/pipes/strict-uuid.pipe';

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Post()
  @ResponseMessage('Subscriptions created successful.')
  create(@Body() createSubscriptionDto: CreateSubscriptionDto) {
    return this.subscriptionsService.create(createSubscriptionDto);
  }

  @Get()
  @ResponseMessage('Subscriptions retrieved successful.')
  findAll(
    @Req() req: any,
    @Query('search') search: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('sortBy') sortBy: string,
    @Query('sortOrder', new DefaultValuePipe('DESC')) sortOrder: 'ASC' | 'DESC',
  ) {
    return this.subscriptionsService.findAll(
      req.subscription.sub,
      search,
      page,
      limit,
      sortBy,
      sortOrder,
    );
  }

  @Get(':id')
  @ResponseMessage('Subscription retrieved successful.')
  findOne(@Param('id', StrictUUIDPipe) id: string) {
    return this.subscriptionsService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Subscription updated successful.')
  update(
    @Param('id', StrictUUIDPipe) id: string,
    @Body() updateSubscriptionDto: UpdateSubscriptionDto,
  ) {
    return this.subscriptionsService.update(id, updateSubscriptionDto);
  }

  @Patch('toggle-status/:id')
  @ResponseMessage('Subscription status updated successful.')
  toggleStatus(@Param('id', StrictUUIDPipe) id: string) {
    return this.subscriptionsService.toggleStatus(id);
  }

  @Delete(':id')
  @ResponseMessage('Subscription removed successful.')
  remove(@Param('id', StrictUUIDPipe) id: string) {
    return this.subscriptionsService.remove(id);
  }
}
