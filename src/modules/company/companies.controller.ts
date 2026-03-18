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
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { StrictUUIDPipe } from 'src/common/pipes/strict-uuid.pipe';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  @ResponseMessage('Company created successful.')
  create(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companiesService.create(createCompanyDto);
  }

  @Get()
  @ResponseMessage('Companies retrieved successful.')
  findAll(
    @Req() req: any,
    @Query('search') search: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('sortBy') sortBy: string,
    @Query('sortOrder', new DefaultValuePipe('DESC')) sortOrder: 'ASC' | 'DESC',
  ) {
    return this.companiesService.findAll(
      req.company.sub,
      search,
      page,
      limit,
      sortBy,
      sortOrder,
    );
  }

  @Get(':id')
  @ResponseMessage('Company retrieved successful.')
  findOne(@Param('id', StrictUUIDPipe) id: string) {
    return this.companiesService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Company updated successful.')
  update(
    @Param('id', StrictUUIDPipe) id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ) {
    return this.companiesService.update(id, updateCompanyDto);
  }

  @Patch('toggle-status/:id')
  @ResponseMessage('Company status updated successful.')
  toggleStatus(@Param('id', StrictUUIDPipe) id: string) {
    return this.companiesService.toggleStatus(id);
  }

  @Delete(':id')
  @ResponseMessage('Company removed successful.')
  remove(@Param('id', StrictUUIDPipe) id: string) {
    return this.companiesService.remove(id);
  }
}
