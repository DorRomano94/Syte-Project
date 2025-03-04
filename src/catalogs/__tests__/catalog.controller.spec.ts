import { Test, TestingModule } from '@nestjs/testing';
import { CatalogController } from '../catalog.controller';
import { CatalogService } from '../catalog.service';
import { CreateCatalogDto } from '../dto/create-catalog.dto';
import { UpdateCatalogDto } from '../dto/update-catalog.dto';
import { Catalog, CatalogVertical } from '../../database/entities/catalog.entity';

describe('CatalogController', () => {
  let controller: CatalogController;
  let service: CatalogService;

  const mockCatalogService = {
    createCatalog: jest.fn(),
    getCatalogs: jest.fn(),
    updateCatalog: jest.fn(),
    deleteCatalog: jest.fn(),
    bulkDeleteCatalogs: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CatalogController],
      providers: [
        { provide: CatalogService, useValue: mockCatalogService },
      ],
    }).compile();

    controller = module.get<CatalogController>(CatalogController);
    service = module.get<CatalogService>(CatalogService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should call createCatalog and return the created catalog', async () => {
      const clientId = 1;
      const dto: CreateCatalogDto = {
        name: 'Summer Fashion',
        vertical: CatalogVertical.FASHION,
        primary: true,
        locales: ['en_US', 'es_ES'],
      };
      const result: Catalog = { id: 1, ...dto } as Catalog;
      mockCatalogService.createCatalog.mockResolvedValue(result);

      expect(await controller.create(clientId, dto)).toEqual(result);
      expect(mockCatalogService.createCatalog).toHaveBeenCalledWith(clientId, dto);
    });
  });

  describe('findAll', () => {
    it('should return an array of catalogs', async () => {
      const clientId = 1;
      const result: Catalog[] = [
        { id: 1, name: 'Summer Fashion', vertical: CatalogVertical.FASHION, primary: true, locales: ['en_US', 'es_ES'] } as Catalog,
        { id: 2, name: 'Winter Fashion', vertical: CatalogVertical.FASHION, primary: false, locales: ['en_US'] } as Catalog,
      ];
      mockCatalogService.getCatalogs.mockResolvedValue(result);

      expect(await controller.findAll(clientId)).toEqual(result);
      expect(mockCatalogService.getCatalogs).toHaveBeenCalledWith(clientId);
    });
  });

  describe('update', () => {
    it('should update a catalog and return the updated catalog', async () => {
      const clientId = 1;
      const catalogId = 1;
      const dto: UpdateCatalogDto = { primary: false, locales: ['en_US'] };
      const result: Catalog = { id: catalogId, name: 'Summer Fashion', vertical: CatalogVertical.FASHION, primary: false, locales: ['en_US'] } as Catalog;
      mockCatalogService.updateCatalog.mockResolvedValue(result);

      expect(await controller.update(clientId, catalogId, dto)).toEqual(result);
      expect(mockCatalogService.updateCatalog).toHaveBeenCalledWith(clientId, catalogId, dto);
    });
  });

  describe('delete', () => {
    it('should delete a catalog and return a success message', async () => {
      const clientId = 1;
      const catalogId = 1;
      const result = { message: 'Catalog successfully deleted' };
      mockCatalogService.deleteCatalog.mockResolvedValue(result);

      expect(await controller.delete(clientId, catalogId)).toEqual(result);
      expect(mockCatalogService.deleteCatalog).toHaveBeenCalledWith(clientId, catalogId);
    });
  });

  describe('bulkDelete', () => {
    it('should delete multiple catalogs and return a success message', async () => {
      const clientId = 1;
      const catalogIds = [1, 2, 3];
      const result = { message: 'Catalogs successfully deleted' };
      mockCatalogService.bulkDeleteCatalogs.mockResolvedValue(result);

      expect(await controller.bulkDelete(clientId, catalogIds)).toEqual(result);
      expect(mockCatalogService.bulkDeleteCatalogs).toHaveBeenCalledWith(clientId, catalogIds);
    });
  });
});
