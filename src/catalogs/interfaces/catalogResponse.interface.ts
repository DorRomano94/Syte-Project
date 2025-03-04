import { CatalogVertical } from "src/database/entities/catalog.entity";

export interface CatalogResponse {
    id: number;
    name: string;
    vertical: CatalogVertical;
    primary: boolean;
    locales: string[];
    isMultiLocale: boolean;
    createdAt: Date,
    updatedAt: Date
}
