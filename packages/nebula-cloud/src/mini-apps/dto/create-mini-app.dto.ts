import { IsOptional, IsString, Matches, MinLength } from 'class-validator';

export class CreateMiniAppDto {
  @IsString()
  @Matches(/^[a-z0-9-]+$/)
  appId!: string;

  @IsString()
  @MinLength(2)
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  iconUrl?: string;
}
