import { join } from 'path';
import { TEMPLATE_CONSTANTS } from '../../config/constants';

export class TemplatePaths {
  static getTemplatePath(templateName: string): string {
    return join(process.cwd(), TEMPLATE_CONSTANTS.VIEWS_PATH, templateName);
  }

  static getTemplateFilePath(templateName: string): string {
    return join(this.getTemplatePath(templateName), TEMPLATE_CONSTANTS.TEMPLATE_FILE);
  }

  static getStaticDataPath(templateName: string): string {
    return join(this.getTemplatePath(templateName), TEMPLATE_CONSTANTS.STATIC_DATA_FILE);
  }

  static getCustomDataPath(templateName: string): string {
    return join(this.getTemplatePath(templateName), TEMPLATE_CONSTANTS.CUSTOM_DATA_FILE);
  }
}