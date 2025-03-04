import { ClientDto } from '../../clients/dto/client.dto';
import { CatalogDto } from '../dto/catalog.dto';

export const createCatalogResponse = {
  status: 201,
  description: 'The catalog has been successfully created.',
  schema: {
    example: {
      "id": 9,
      "name": "Summer Fashion",
      "vertical": "fashion",
      "primary": true,
      "locales": [
        "en_US",
        "es_ES"
      ],
      createdAt: "2025-03-02T13:13:07.425Z",
      updatedAt: "2025-03-02T13:13:07.425Z",
      "client": {
        "id": 3,
        "name": "Dor Romano"
      }
    },
  },
};

export const catalogBadRequestResponse = {
  status: 400,
  description: 'Catalog details are incorrect',
  schema: {
    example: {
      statusCode: 400,
      message: 'Validation failed',
      error: 'Bad Request',
    },
  },
};

export const getAllCatalogsResponse = {
  status: 200,
  description: 'List of catalogs for the client',
  type: [CatalogDto],
  schema: {
    example: [
      {
        id: 1,
        name: 'Summer Fashion',
        vertical: 'fashion',
        locales: ['en_US', 'es_ES'],
        primary: true,
        createdAt: "2025-03-02T13:13:07.425Z",
        updatedAt: "2025-03-02T13:13:07.425Z"
      },
      {
        id: 2,
        name: 'Winter Fashion',
        vertical: 'fashion',
        locales: ['en_US'],
        primary: false,
        createdAt: "2025-03-02T13:13:07.425Z",
        updatedAt: "2025-03-02T13:13:07.425Z"
      },
    ],
  },
};

export const catalogNotFoundResponse = {
  status: 404,
  description: 'Catalog not found',
  schema: {
    example: {
      statusCode: 404,
      message: 'Catalog with ID 1 not found for client 1',
      error: 'Not Found',
    },
  },
};

export const updateCatalogResponse = {
  status: 200,
  description: 'The catalog has been successfully updated.',
  type: CatalogDto,
  schema: {
    example: {
      id: 1,
      name: 'Summer Fashion',
      vertical: 'fashion',
      locales: ['en_US'],
      primary: false,
      createdAt: "2025-03-02T13:13:07.425Z",
      updatedAt: "2025-03-02T13:13:07.425Z"
    },
  },
};

export const deleteCatalogResponse = {
  status: 200,
  description: 'Catalog successfully deleted',
  schema: {
    example: {
      message: 'Catalog successfully deleted',
    },
  },
};

export const bulkDeleteCatalogResponse = {
  status: 200,
  description: 'Catalogs successfully deleted',
  schema: {
    example: {
      message: 'Catalogs successfully deleted',
    },
  },
};
