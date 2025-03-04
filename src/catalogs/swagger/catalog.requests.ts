import { CreateCatalogDto } from '../dto/create-catalog.dto';
import { UpdateCatalogDto } from '../dto/update-catalog.dto';

export const createCatalogBody = {
    description: 'Request body to create a new catalog',
    type: CreateCatalogDto,
    examples: {
        'application/json': {
            value: {
                name: 'Summer Fashion',
                vertical: 'fashion',
                locales: ['en_US', 'es_ES'],
                primary: true,
            },
        },
    },
};

export const updateCatalogBody = {
    description: 'Request body to update an existing catalog',
    type: UpdateCatalogDto,
    examples: {
        'application/json': {
            value: {
                primary: false,
                locales: ['en_US'],
            },
        },
    },
};

export const bulkDeleteCatalogBody = {
    description: 'Request body to delete multiple catalogs',
    type: [Number],
    examples: {
        'application/json': {
            value: {
                catalogIds: [1, 2, 3],
            },
        },
    },
}
