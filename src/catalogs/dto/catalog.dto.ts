import { ApiProperty } from '@nestjs/swagger';

export class CatalogDto {
  @ApiProperty({
    description: 'Catalog ID',
    type: String,
    example: '1',
  })
  id: number;

  @ApiProperty({
    description: 'The name of the catalog',
    type: String,
    example: 'Fashion Catalog',
  })
  name: string;

  @ApiProperty({
    description: 'The type of the catalog (fashion/home/general)',
    type: String,
    example: 'fashion',
    enum: ['fashion', 'home', 'general'],
  })
  vertical: string;

  @ApiProperty({
    description: 'Indicates if the catalog is primary',
    type: Boolean,
    example: true,
  })
  primary: boolean;

  @ApiProperty({
    description: 'List of locales for the catalog',
    type: [String],
    example: ['en_US', 'en_CA'],
  })
  locales: string[];

  
  @ApiProperty({
    description: 'The created date of the catalog',
    type: Date,
    example: "2025-03-02T13:13:07.425Z",
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The last update date of the catalog',
    type: Date,
    example: "2025-03-02T13:13:07.425Z",
  })
  updatedAt: Date;
}
