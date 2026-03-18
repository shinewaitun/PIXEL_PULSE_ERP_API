import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, FindOptionsWhere, ILike, Not, Repository } from 'typeorm';
import { Company } from './entities/company.entity';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  async create(createCompanyDto: CreateCompanyDto): Promise<Company> {
    const company = this.companyRepository.create(createCompanyDto);
    return await this.companyRepository.save(company);
  }

  async findAll(
    currentCompanyId: string,
    search?: string,
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'createdAt',
    sortOrder: 'ASC' | 'DESC' = 'DESC',
  ) {
    const skip = (page - 1) * limit;

    const excludeSelf = Not(Equal(currentCompanyId));

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

    const [companies, totalCount] = await this.companyRepository.findAndCount({
      where: whereCondition as FindOptionsWhere<Company>,
      take: limit,
      skip: skip,
      order: {
        [sortBy]: sortOrder,
      },
    });

    const totalPages = Math.ceil(totalCount / limit);

    return {
      data: companies,
      meta: {
        totalCount,
        totalPages,
        currentPage: page,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  async findOne(id: string): Promise<Company> {
    const company = await this.companyRepository.findOne({ where: { id } });
    if (!company) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }
    return company;
  }

  async update(
    id: string,
    updateCompanyDto: UpdateCompanyDto,
  ): Promise<Company> {
    const company = await this.findOne(id);
    Object.assign(company, updateCompanyDto);
    return await this.companyRepository.save(company);
  }

  async toggleStatus(id: string): Promise<Company> {
    const company = await this.findOne(id);
    company.isActive = !company.isActive;
    return await this.companyRepository.save(company);
  }

  async remove(id: string): Promise<void> {
    const company = await this.findOne(id);
    await this.companyRepository.softRemove(company);
  }
}
