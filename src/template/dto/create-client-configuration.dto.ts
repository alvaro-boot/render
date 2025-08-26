import { IsString, IsEnum, IsArray, IsOptional, ValidateNested, IsBoolean, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class SectionConfigurationDto {
  @IsString()
  id: string;

  @IsBoolean()
  enabled: boolean;

  @IsNumber()
  order: number;

  @IsOptional()
  data?: any;
}

export class CompanyDto {
  @IsString()
  name: string;

  @IsString()
  tagline: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  logo?: string;

  @IsOptional()
  @IsString()
  favicon?: string;
}

export class ThemeColorsDto {
  @IsString()
  primary: string;

  @IsString()
  primaryForeground: string;

  @IsString()
  secondary: string;

  @IsString()
  secondaryForeground: string;

  @IsString()
  background: string;

  @IsString()
  foreground: string;

  @IsString()
  accent: string;

  @IsString()
  accentForeground: string;
}

export class FontsDto {
  @IsString()
  heading: string;

  @IsString()
  body: string;
}

export class ThemeDto {
  @ValidateNested()
  @Type(() => ThemeColorsDto)
  colors: ThemeColorsDto;

  @ValidateNested()
  @Type(() => FontsDto)
  fonts: FontsDto;
}

export class CreateClientConfigurationDto {
  @IsString()
  clientId: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(['clasico', 'moderno', 'minimalista', 'colorido'])
  style: 'clasico' | 'moderno' | 'minimalista' | 'colorido';

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SectionConfigurationDto)
  sections: SectionConfigurationDto[];

  @ValidateNested()
  @Type(() => CompanyDto)
  company: CompanyDto;

  @ValidateNested()
  @Type(() => ThemeDto)
  theme: ThemeDto;
}
