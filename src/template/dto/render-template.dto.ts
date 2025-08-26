import { IsObject, IsOptional } from 'class-validator';

export class RenderTemplateDto {
  @IsOptional()
  @IsObject()
  data?: any;
}