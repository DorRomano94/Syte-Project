import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Catalog, CatalogVertical } from '../database/entities/catalog.entity';
import { CreateCatalogDto } from './dto/create-catalog.dto';
import { UpdateCatalogDto } from './dto/update-catalog.dto';
import { Client } from '../database/entities/client.entity';

export interface CatalogResponse {
  id: number;
  name: string;
  vertical: CatalogVertical;
  primary: boolean;
  locales: string[];
  isMultiLocale: boolean;
  createdAt: Date,
  updatedAt: Date
}

@Injectable()
export class CatalogService {
  constructor(
    @InjectRepository(Catalog)
    private readonly catalogRepository: Repository<Catalog>,
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) { }

  async createCatalog(clientId: number, createDto: CreateCatalogDto): Promise<Catalog> {
    const client = await this.clientRepository.findOne({ where: { id: clientId } });
    if (!client) {
      throw new NotFoundException(`Client with ID ${clientId} not found`);
    }

    const existingCatalog = await this.catalogRepository.findOne({
      where: { name: createDto.name, id: clientId },
    });

    if (existingCatalog) {
      throw new ConflictException(`Catalog with name '${createDto.name}' already exists for client with ID ${clientId}`);
    }

    if (createDto.primary) {
      await this.catalogRepository
        .createQueryBuilder()
        .update(Catalog)
        .set({ primary: false })
        .where('clientId = :clientId', { clientId })
        .andWhere('vertical = :vertical', { vertical: createDto.vertical })
        .andWhere('primary = :primary', { primary: true })
        .execute();
    }

    const catalog = this.catalogRepository.create({
      ...createDto,
      client,
    });

    return this.catalogRepository.save(catalog);
  }

  async getCatalogs(clientId: number): Promise<CatalogResponse[]> {
    const catalogs = await this.catalogRepository.find({
      where: { client: { id: clientId } },
    });

    return catalogs.map((catalog) => ({
      id: catalog.id,
      name: catalog.name,
      vertical: catalog.vertical,
      primary: catalog.primary,
      locales: catalog.locales,
      isMultiLocale: catalog.locales.length > 1,
      createdAt: catalog.createdAt,
      updatedAt: catalog.updatedAt
    }));
  }

  async updateCatalog(clientId: number, catalogId: number, updateDto: UpdateCatalogDto): Promise<Catalog> {
    const catalog = await this.catalogRepository.findOne({
      where: { id: catalogId, client: { id: clientId } },
    });
    if (!catalog) {
      throw new NotFoundException(`Catalog with ID ${catalogId} not found for client ${clientId}`);
    }

    if (updateDto.primary && updateDto.primary === true) {
      await this.catalogRepository
        .createQueryBuilder()
        .update(Catalog)
        .set({ primary: false })
        .where('clientId = :clientId', { clientId })
        .andWhere('vertical = :vertical', { vertical: catalog.vertical })
        .andWhere('primary = :primary', { primary: true })
        .andWhere('id != :catalogId', { catalogId })
        .execute();
    }

    // Merge the updated fields
    Object.assign(catalog, updateDto);
    return this.catalogRepository.save(catalog);
  }

  async deleteCatalog(clientId: number, catalogId: number): Promise<{ message: string }> {
    const result = await this.catalogRepository.delete({
      id: catalogId,
      client: { id: clientId },
    });
    if (result.affected === 0) {
      throw new NotFoundException(`Catalog with ID ${catalogId} not found for client ${clientId}`);
    }
    return { message: 'Catalog successfully deleted' };
  }

  async bulkDeleteCatalogs(clientId: number, catalogIds: number[]): Promise<{ message: string }> {
    if (!Array.isArray(catalogIds)) {
      throw new Error('catalogIds should be an array');
    }

    await this.catalogRepository.delete({
      id: In(catalogIds),
      client: { id: clientId },
    });

    return { message: 'Catalogs successfully deleted' };
  }
}