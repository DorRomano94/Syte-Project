import { Controller, Post, Get, Put, Delete, Param, Body } from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { ClientDto } from './dto/client.dto';

import {
  createClientResponse,
  badRequestResponse,
  getAllClientsResponse,
  clientNotFoundResponse,
  updateClientResponse,
  deleteClientResponse,
} from './swagger/client.responses';
import { createClientBody, updateClientBody } from './swagger/client.requests';

@ApiTags('clients')
@Controller('clients')
export class ClientController {
  constructor(private readonly clientService: ClientService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new client' })
  @ApiResponse(createClientResponse)
  @ApiResponse(badRequestResponse)
  @ApiBody(createClientBody)
  async create(@Body() createClientDto: CreateClientDto) {
    return await this.clientService.create(createClientDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get list of all clients' })
  @ApiResponse(getAllClientsResponse)
  async findAll() {
    return await this.clientService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a client by ID' })
  @ApiResponse({ status: 200, description: 'Client found', type: ClientDto })
  @ApiResponse(clientNotFoundResponse)
  async findOne(@Param('id') id: number) {
    return await this.clientService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update client details' })
  @ApiResponse(updateClientResponse)
  @ApiResponse(badRequestResponse)
  @ApiBody(updateClientBody)
  async update(@Param('id') id: number, @Body() updateClientDto: UpdateClientDto) {
    return await this.clientService.update(id, updateClientDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a client' })
  @ApiResponse(deleteClientResponse)
  @ApiResponse(clientNotFoundResponse)
  async delete(@Param('id') id: number) {
    return await this.clientService.delete(id);
  }
}
