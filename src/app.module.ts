import { Module } from '@nestjs/common';
import { ClientModule } from './clients/client.module';
import { CatalogModule } from './catalogs/catalog.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    DatabaseModule,
    ClientModule,
    CatalogModule,
  ],
})
export class AppModule { }
