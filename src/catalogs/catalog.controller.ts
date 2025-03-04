import { Controller, Post, Get, Put, Delete, Param, Body } from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { CreateCatalogDto } from './dto/create-catalog.dto';
import { UpdateCatalogDto } from './dto/update-catalog.dto';
import { ApiOperation, ApiResponse, ApiTags, ApiBody } from '@nestjs/swagger';
import {
  createCatalogResponse,
  catalogBadRequestResponse,
  getAllCatalogsResponse,
  catalogNotFoundResponse,
  updateCatalogResponse,
  deleteCatalogResponse,
  bulkDeleteCatalogResponse,
} from './swagger/catalog.responses';
import { createCatalogBody, updateCatalogBody } from './swagger/catalog.requests';

@ApiTags('catalogs')
@Controller('clients/:clientId/catalogs')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Post()
  @ApiOperation({ summary: 'Add a new catalog' })
  @ApiBody(createCatalogBody)
  @ApiResponse(createCatalogResponse)
  @ApiResponse(catalogBadRequestResponse)
  create(
    @Param('clientId') clientId: number,
    @Body() createDto: CreateCatalogDto,
  ) {
    return this.catalogService.createCatalog(clientId, createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all catalogs for a client' })
  @ApiResponse(getAllCatalogsResponse)
  findAll(@Param('clientId') clientId: number) {
    return this.catalogService.getCatalogs(clientId);
  }

  @Put(':catalogId')
  @ApiOperation({ summary: 'Update a catalog' })
  @ApiBody(updateCatalogBody)
  @ApiResponse(updateCatalogResponse)
  update(
    @Param('clientId') clientId: number,
    @Param('catalogId') catalogId: number,
    @Body() updateDto: UpdateCatalogDto,
  ) {
    return this.catalogService.updateCatalog(clientId, catalogId, updateDto);
  }

  @Delete(':catalogId')
  @ApiOperation({ summary: 'Delete a catalog' })
  @ApiResponse(deleteCatalogResponse)
  delete(
    @Param('clientId') clientId: number,
    @Param('catalogId') catalogId: number,
  ) {
    return this.catalogService.deleteCatalog(clientId, catalogId);
  }

  @Delete()
  @ApiOperation({ summary: 'Bulk delete catalogs' })
  @ApiBody({
    description: 'Request body to delete multiple catalogs',
    type: [Number],
    examples: {
      'application/json': {
        value: {
          catalogIds: [1, 2, 3],
        },
      },
    },
  })
  @ApiResponse(bulkDeleteCatalogResponse)
  bulkDelete(
    @Param('clientId') clientId: number,
    @Body('catalogIds') catalogIds: number[],
  ) {
    return this.catalogService.bulkDeleteCatalogs(clientId, catalogIds);
  }
}
