import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateMiniAppDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  iconUrl?: string;
}
