import { Test, TestingModule } from '@nestjs/testing';
import { ClientController } from '../client.controller';
import { ClientService } from '../client.service';
import { CreateClientDto } from '../dto/create-client.dto';
import { UpdateClientDto } from '../dto/update-client.dto';
import { Client } from '../../database/entities/client.entity';

describe('ClientController', () => {
  let controller: ClientController;
  let service: ClientService;

  const mockClientService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientController],
      providers: [
        { provide: ClientService, useValue: mockClientService },
      ],
    }).compile();

    controller = module.get<ClientController>(ClientController);
    service = module.get<ClientService>(ClientService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create and return a new client', async () => {
      const dto: CreateClientDto = { name: 'Client Name' };
      const result: Client = { id: 1, name: 'Client Name' } as Client;
      mockClientService.create.mockResolvedValue(result);

      expect(await controller.create(dto)).toEqual(result);
      expect(mockClientService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return an array of clients', async () => {
      const result: Client[] = [{ id: 1, name: 'Client Name' } as Client];
      mockClientService.findAll.mockResolvedValue(result);

      expect(await controller.findAll()).toEqual(result);
      expect(mockClientService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a client by ID', async () => {
      const result: Client = { id: 1, name: 'Client Name' } as Client;
      mockClientService.findOne.mockResolvedValue(result);

      expect(await controller.findOne(1)).toEqual(result);
      expect(mockClientService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update and return the client', async () => {
      const dto: UpdateClientDto = { name: 'Updated Client Name' };
      const result: Client = { id: 1, name: 'Updated Client Name' } as Client;
      mockClientService.update.mockResolvedValue(result);

      expect(await controller.update(1, dto)).toEqual(result);
      expect(mockClientService.update).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('delete', () => {
    it('should delete the client and return undefined (or success response)', async () => {
      mockClientService.delete.mockResolvedValue(undefined);
      await expect(controller.delete(1)).resolves.toBeUndefined();
      expect(mockClientService.delete).toHaveBeenCalledWith(1);
    });
  });
});
