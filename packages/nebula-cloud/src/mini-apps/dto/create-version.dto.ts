import { IsOptional, IsString } from 'class-validator';

export class CreateVersionDto {
  @IsString()
  version!: string;

  @IsOptional()
  @IsString()
  changelog?: string;
}
