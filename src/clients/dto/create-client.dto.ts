import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateClientDto {
  @IsString()
  @IsNotEmpty({ message: 'The client name cannot be empty' })
  @ApiProperty({
    description: 'The name of the client',
    type: String,
    example: 'Dor Romano',
  })
  name: string;
}
