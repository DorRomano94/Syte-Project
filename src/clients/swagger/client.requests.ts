import { CreateClientDto } from "../dto/create-client.dto";
import { UpdateClientDto } from "../dto/update-client.dto";

export const createClientBody = {
    description: 'Request body to create a new catalog',
    type: CreateClientDto,
    examples: {
        'application/json': {
            value: {
                name: 'Dor Romano',
              },
        },
    },
};

export const updateClientBody = {
    description: 'Request body to update a new catalog',
    type: UpdateClientDto,
    examples: {
        'application/json': {
            value: {
                name: 'Dor Romano',
              },
        },
    },
};