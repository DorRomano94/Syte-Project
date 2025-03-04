import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateClientDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'The name of the client',
    type: String,
    example: 'Dor Romano',
  })
  name?: string;
}
