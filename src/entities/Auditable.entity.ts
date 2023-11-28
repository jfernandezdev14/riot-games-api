import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

export class Auditable {
  @CreateDateColumn({ name: 'created_at' })
  @ApiPropertyOptional({ description: 'Created At' })
  createdAt?: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  @ApiPropertyOptional({ description: 'Updated At' })
  updatedAt?: Date;
}
