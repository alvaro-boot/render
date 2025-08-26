import { BaseTemplateData } from '../../shared/interfaces/base-template-data.interface';

export interface TemplateData extends BaseTemplateData {
  [key: string]: any;
}

export interface TemplateInfo {
  name: string;
  hasTemplate: boolean;
  hasStaticData: boolean;
  hasCustomData: boolean;
  files: FileInfo[];
}

export interface FileInfo {
  name: string;
  size: number;
  modified: Date;
  isDirectory: boolean;
}