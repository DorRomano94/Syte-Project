import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Catalog } from '../database/entities/catalog.entity';
import { CatalogService } from './catalog.service';
import { CatalogController } from './catalog.controller';
import { Client } from '../database/entities/client.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Catalog, Client])],
  providers: [CatalogService],
  controllers: [CatalogController],
})
export class CatalogModule {}
