import { IsString, IsBoolean, IsArray, ArrayNotEmpty, IsEnum, Matches } from 'class-validator';
import { CatalogVertical } from '../../database/entities/catalog.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCatalogDto {
  @IsString()
  @Matches(/^[A-Za-z\s]+$/, { message: 'Name must contain only letters and spaces' })
  @ApiProperty({
    description: 'The name of the catalog',
    type: String,
    example: 'Summer Fashion',
  })
  name: string;

  @IsEnum(CatalogVertical, { message: 'Vertical must be one of fashion, home, or general' })
  @ApiProperty({
    description: 'The type of the catalog (fashion/home/general)',
    type: String,
    example: 'fashion',
    enum: ['fashion', 'home', 'general'],
  })
  vertical: CatalogVertical;

  @IsBoolean()
  @ApiProperty({
    description: 'Indicates if the catalog is primary',
    type: Boolean,
    example: true,
  })
  primary: boolean;

  @IsArray()
  @ArrayNotEmpty({ message: 'Locales array cannot be empty' })
  @IsString({ each: true })
  @Matches(/^[a-z]{2}_[A-Z]{2}$/, { 
    each: true, 
    message: 'Each locale must be in format "xx_XX" (e.g., en_US)' 
  })
  @ApiProperty({
    description: 'List of locales for the catalog',
    type: [String],
    example: ['en_US', 'en_CA'],
  })
  locales: string[];
}