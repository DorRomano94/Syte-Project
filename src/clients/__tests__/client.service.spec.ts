import { Test, TestingModule } from '@nestjs/testing';
import { ClientService } from '../client.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Client } from '../../database/entities/client.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { CreateClientDto } from '../dto/create-client.dto';
import { UpdateClientDto } from '../dto/update-client.dto';

describe('ClientService', () => {
  let service: ClientService;
  let clientRepository: Repository<Client>;

  const mockClientRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientService,
        {
          provide: getRepositoryToken(Client),
          useValue: mockClientRepository,
        },
      ],
    }).compile();

    service = module.get<ClientService>(ClientService);
    clientRepository = module.get<Repository<Client>>(getRepositoryToken(Client));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create and return a new client', async () => {
      const dto: CreateClientDto = { name: 'Client Name' };
      const createdClient = { id: 1, name: dto.name } as Client;
      mockClientRepository.create.mockReturnValue(createdClient);
      mockClientRepository.save.mockResolvedValue(createdClient);

      const result = await service.create(dto);
      expect(result).toEqual(createdClient);
      expect(mockClientRepository.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return an array of clients', async () => {
      const clients: Client[] = [{ id: 1, name: 'Client Name' } as Client];
      mockClientRepository.find.mockResolvedValue(clients);
      const result = await service.findAll();
      expect(result).toEqual(clients);
    });
  });

  describe('findOne', () => {
    it('should return a client if found', async () => {
      const client = { id: 1, name: 'Client Name' } as Client;
      mockClientRepository.findOne.mockResolvedValue(client);
      const result = await service.findOne(1);
      expect(result).toEqual(client);
    });

    it('should throw NotFoundException if client not found', async () => {
      mockClientRepository.findOne.mockResolvedValue(null);
      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update and return the client', async () => {
      const client = { id: 1, name: 'Client Name' } as Client;
      const updatedClient = { id: 1, name: 'Updated Name' } as Client;
      mockClientRepository.findOne.mockResolvedValue(client);
      mockClientRepository.save.mockResolvedValue(updatedClient);
      const dto: UpdateClientDto = { name: 'Updated Name' };

      const result = await service.update(1, dto);
      expect(result).toEqual(updatedClient);
    });
  });

  describe('delete', () => {
    it('should delete the client if found', async () => {
      mockClientRepository.delete.mockResolvedValue({ affected: 1 });
      await expect(service.delete(1)).resolves.not.toThrow();
    });

    it('should throw NotFoundException if client not found', async () => {
      mockClientRepository.delete.mockResolvedValue({ affected: 0 });
      await expect(service.delete(1)).rejects.toThrow(NotFoundException);
    });
  });
});
