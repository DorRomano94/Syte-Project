import { ApiProperty } from '@nestjs/swagger';

export class ClientDto {
  @ApiProperty({
    description: 'Client ID',
    type: String,
    example: '1',
  })
  id: number;

  @ApiProperty({
    description: 'The name of the client',
    type: String,
    example: 'Dor Romano',
  })
  name: string;

  @ApiProperty({
    description: 'The created date of the client',
    type: Date,
    example: "2025-03-02T13:13:07.425Z",
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The last update date of the client',
    type: Date,
    example: "2025-03-02T13:13:07.425Z",
  })
  updatedAt: Date;
}
