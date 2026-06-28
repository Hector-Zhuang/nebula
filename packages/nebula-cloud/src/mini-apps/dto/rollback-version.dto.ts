import { IsOptional, IsString } from 'class-validator';

export class RollbackVersionDto {
  @IsString()
  targetVersionId!: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
