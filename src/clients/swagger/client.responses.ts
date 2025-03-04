import { ClientDto } from '../dto/client.dto';

export const createClientResponse = {
  status: 201,
  description: 'Client successfully created',
  type: ClientDto,
  schema: {
    example: {
      name: 'Client Name',
    },
  },
};

export const badRequestResponse = {
  status: 400,
  description: 'Client details are incorrect',
  schema: {
    example: {
      statusCode: 400,
      message: 'The client name cannot be empty',
      error: 'Bad Request',
    },
  },
};

export const getAllClientsResponse = {
  status: 200,
  description: 'List of clients',
  type: [ClientDto],
  schema: {
    example: [
      { name: 'Client Name' },
    ],
  },
};

export const clientNotFoundResponse = {
  status: 404,
  description: 'Client not found',
  schema: {
    example: {
      statusCode: 404,
      message: 'Client with ID 1 not found',
      error: 'Not Found',
    },
  },
};

export const updateClientResponse = {
  status: 200,
  description: 'Client successfully updated',
  type: ClientDto,
  schema: {
    example: {
      name: 'Updated Client Name',
    },
  },
};

export const deleteClientResponse = {
  status: 200,
  description: 'Client successfully deleted',
  schema: {
    example: {
      statusCode: 200,
      message: 'Client successfully deleted',
    },
  },
};
