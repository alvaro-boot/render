import { BaseTemplateData } from '../../shared/interfaces/base-template-data.interface';

export interface TemplateData extends BaseTemplateData {
  // Permite propiedades adicionales específicas de cada plantilla
  [key: string]: any;
}