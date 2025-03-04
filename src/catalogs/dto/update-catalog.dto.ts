import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsBoolean, IsArray, ArrayNotEmpty } from 'class-validator';

export class UpdateCatalogDto {
  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    description: 'Indicates if the catalog is primary',
    type: Boolean,
    example: true,
  })
  primary?: boolean;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty({ message: 'Locales array cannot be empty when provided' })
  @ApiProperty({
    description: 'List of locales for the catalog',
    type: [String],
    example: ['en_US', 'en_CA'],
  })
  locales?: string[];
}
