import { Test, TestingModule } from '@nestjs/testing';
import { CatalogService } from '../catalog.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Catalog, CatalogVertical } from '../../database/entities/catalog.entity';
import { Client } from '../../database/entities/client.entity';
import { Repository } from 'typeorm';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { CreateCatalogDto } from '../dto/create-catalog.dto';
import { UpdateCatalogDto } from '../dto/update-catalog.dto';

describe('CatalogService', () => {
  let service: CatalogService;
  let catalogRepository: Repository<Catalog>;
  let clientRepository: Repository<Client>;

  const mockCatalogRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnValue({
      update: jest.fn().mockReturnThis(),
      set: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      execute: jest.fn(),
    }),
    delete: jest.fn(),
    find: jest.fn(),
  };

  const mockClientRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CatalogService,
        {
          provide: getRepositoryToken(Catalog),
          useValue: mockCatalogRepository,
        },
        {
          provide: getRepositoryToken(Client),
          useValue: mockClientRepository,
        },
      ],
    }).compile();

    service = module.get<CatalogService>(CatalogService);
    catalogRepository = module.get<Repository<Catalog>>(getRepositoryToken(Catalog));
    clientRepository = module.get<Repository<Client>>(getRepositoryToken(Client));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createCatalog', () => {
    it('should throw NotFoundException if client does not exist', async () => {
      mockClientRepository.findOne.mockResolvedValue(null);
      const dto: CreateCatalogDto = {
        name: 'FashionCatalog',
        vertical: CatalogVertical.FASHION,
        primary: true,
        locales: ['en_US', 'en_CA'],
      };
      await expect(service.createCatalog(1, dto)).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException if catalog with same name exists for the client', async () => {
      const client = { id: 1 } as Client;
      mockClientRepository.findOne.mockResolvedValue(client);

      mockCatalogRepository.findOne.mockResolvedValue({ id: 1 });
      const dto: CreateCatalogDto = {
        name: 'FashionCatalog',
        vertical: CatalogVertical.FASHION,
        primary: false,
        locales: ['en_US'],
      };
      await expect(service.createCatalog(1, dto)).rejects.toThrow(ConflictException);
    });

    it('should update existing primary catalogs when creating a new primary catalog', async () => {
      const client = { id: 1 } as Client;
      mockClientRepository.findOne.mockResolvedValue(client);

      mockCatalogRepository.findOne.mockResolvedValue(null);

      const executeMock = jest.fn().mockResolvedValue({ affected: 1 });
      const andWhereMock = jest.fn().mockReturnThis();
      const whereMock = jest.fn().mockReturnThis();
      const setMock = jest.fn().mockReturnThis();
      const updateMock = jest.fn().mockReturnThis();
      const createQueryBuilderMock = jest.fn().mockReturnValue({
        update: updateMock,
        set: setMock,
        where: whereMock,
        andWhere: andWhereMock,
        execute: executeMock,
      });
      mockCatalogRepository.createQueryBuilder = createQueryBuilderMock;

      const dto: CreateCatalogDto = {
        name: 'FashionCatalog',
        vertical: CatalogVertical.FASHION,
        primary: true,
        locales: ['en_US', 'en_CA'],
      };

      const createdCatalog = { id: 1, ...dto } as Catalog;
      mockCatalogRepository.create.mockReturnValue(createdCatalog);
      mockCatalogRepository.save.mockResolvedValue(createdCatalog);

      const result = await service.createCatalog(1, dto);

      expect(createQueryBuilderMock).toHaveBeenCalled();
      expect(updateMock).toHaveBeenCalledWith(Catalog);
      expect(setMock).toHaveBeenCalledWith({ primary: false });
      expect(whereMock).toHaveBeenCalledWith('clientId = :clientId', { clientId: 1 });
      expect(andWhereMock).toHaveBeenCalledWith('vertical = :vertical', { vertical: dto.vertical });
      expect(andWhereMock).toHaveBeenCalledWith('primary = :primary', { primary: true });
      expect(executeMock).toHaveBeenCalled();

      expect(result).toEqual(createdCatalog);
    });

    it('should not update primary catalogs if new catalog is not primary', async () => {
      const client = { id: 1 } as Client;
      mockClientRepository.findOne.mockResolvedValue(client);
      mockCatalogRepository.findOne.mockResolvedValue(null);

      const dto: CreateCatalogDto = {
        name: 'CasualCatalog',
        vertical: CatalogVertical.HOME,
        primary: false,
        locales: ['en_US'],
      };

      const createdCatalog = { id: 2, ...dto } as Catalog;
      mockCatalogRepository.create.mockReturnValue(createdCatalog);
      mockCatalogRepository.save.mockResolvedValue(createdCatalog);

      const result = await service.createCatalog(1, dto);

      expect(mockCatalogRepository.createQueryBuilder).not.toHaveBeenCalled();
      expect(result).toEqual(createdCatalog);
    });
  });

  describe('getCatalogs', () => {
    it('should return catalog responses with multi-locale indication', async () => {
      const catalogs: Catalog[] = [
        {
          id: 1,
          name: 'CatalogOne',
          vertical: CatalogVertical.FASHION,
          primary: true,
          locales: ['en_US', 'es_ES'],
          client: { id: 1 } as Client,
        } as Catalog,
        {
          id: 2,
          name: 'CatalogTwo',
          vertical: CatalogVertical.HOME,
          primary: false,
          locales: ['en_US'],
          client: { id: 1 } as Client,
        } as Catalog,
      ];

      mockCatalogRepository.find.mockResolvedValue(catalogs);
      const result = await service.getCatalogs(1);
      expect(result).toEqual([
        { 
          id: 1, 
          name: 'CatalogOne', 
          vertical: CatalogVertical.FASHION, 
          primary: true, 
          locales: ['en_US', 'es_ES'], 
          isMultiLocale: true 
        },
        { 
          id: 2, 
          name: 'CatalogTwo', 
          vertical: CatalogVertical.HOME, 
          primary: false, 
          locales: ['en_US'], 
          isMultiLocale: false 
        },
      ]);
    });
  });

  describe('updateCatalog', () => {
    it('should throw NotFoundException if catalog not found', async () => {
      mockCatalogRepository.findOne.mockResolvedValue(null);
      const dto: UpdateCatalogDto = { primary: true, locales: ['en_US'] };
      await expect(service.updateCatalog(1, 1, dto)).rejects.toThrow(NotFoundException);
    });

    it('should update and return the catalog', async () => {
      const catalog = {
        id: 1,
        name: 'CatalogOne',
        vertical: CatalogVertical.FASHION,
        primary: false,
        locales: ['en_US'],
        client: { id: 1 } as Client,
      } as Catalog;

      mockCatalogRepository.findOne.mockResolvedValue(catalog);
      const updatedCatalog = { ...catalog, primary: true, locales: ['en_US', 'en_CA'] };
      mockCatalogRepository.save.mockResolvedValue(updatedCatalog);

      const dto: UpdateCatalogDto = { primary: true, locales: ['en_US', 'en_CA'] };
      const result = await service.updateCatalog(1, 1, dto);
      expect(result).toEqual(updatedCatalog);
    });
  });

  describe('deleteCatalog', () => {
    it('should throw NotFoundException if catalog to delete not found', async () => {
      mockCatalogRepository.delete.mockResolvedValue({ affected: 0 });
      await expect(service.deleteCatalog(1, 1)).rejects.toThrow(NotFoundException);
    });

    it('should return success message on deletion', async () => {
      mockCatalogRepository.delete.mockResolvedValue({ affected: 1 });
      const result = await service.deleteCatalog(1, 1);
      expect(result).toEqual({ message: 'Catalog successfully deleted' });
    });
  });

  describe('bulkDeleteCatalogs', () => {
    it('should throw error if catalogIds is not an array', async () => {
      await expect(service.bulkDeleteCatalogs(1, null as any)).rejects.toThrow('catalogIds should be an array');
    });

    it('should delete multiple catalogs and return success message', async () => {
      mockCatalogRepository.delete.mockResolvedValue({ affected: 2 });
      const result = await service.bulkDeleteCatalogs(1, [1, 2]);
      expect(result).toEqual({ message: 'Catalogs successfully deleted' });
    });
  });
});
