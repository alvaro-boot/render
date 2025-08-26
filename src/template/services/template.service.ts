import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { join } from 'path';
import * as Handlebars from 'handlebars';
import { FileStorageService } from '../../storage/services/file-storage.service';
import { FileUtils } from '../../shared/utils/file.utils';
import { TEMPLATE_CONSTANTS, HTTP_MESSAGES, TEMPLATE_CATEGORIES, TemplateCategory } from '../../config/constants';
import { TemplateData } from '../interfaces/template-data.interface';

type RenderMode = 'static' | 'full' | 'preview';

@Injectable()
export class TemplateService {
  constructor(private readonly fileStorageService: FileStorageService) {
    this.registerHandlebarsHelpers();
  }

  /**
   * Renderiza una plantilla según el modo especificado
   */
  async renderTemplate(
    templateName: string,
    mode: RenderMode,
    previewData?: any,
    category?: TemplateCategory,
  ): Promise<string> {
    try {
      FileUtils.validateTemplateName(templateName);

      const { path: templatePath, category: resolvedCategory } =
        await this.resolveTemplateLocation(templateName, category);

      const templateFilePath = join(templatePath, TEMPLATE_CONSTANTS.TEMPLATE_FILE);

      // Verificar que la plantilla existe
      if (!(await FileUtils.fileExists(templateFilePath))) {
        throw new NotFoundException(HTTP_MESSAGES.TEMPLATE_NOT_FOUND);
      }

      // Leer el contenido de la plantilla
      const templateContent = await FileUtils.readTemplateFile(templateFilePath);

      // Compilar la plantilla con Handlebars
      const template = Handlebars.compile(templateContent);

      // Obtener los datos según el modo
      const data = await this.getTemplateData(templateName, mode, previewData, resolvedCategory);

      // Renderizar y retornar HTML
      return template(data);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`${HTTP_MESSAGES.TEMPLATE_RENDER_ERROR}: ${error.message}`);
    }
  }

  /**
   * Obtiene los datos de la plantilla según el modo
   */
  private async getTemplateData(
    templateName: string,
    mode: RenderMode,
    previewData?: any,
    category?: TemplateCategory,
  ): Promise<TemplateData> {
    const staticData = await this.getStaticData(templateName, category);

    switch (mode) {
      case 'static':
        return staticData;

      case 'full':
        const customData = await this.getCustomData(templateName, category);
        return FileUtils.deepMerge({}, staticData, customData);

      case 'preview':
        const customDataForPreview = await this.getCustomData(templateName, category);
        return FileUtils.deepMerge({}, staticData, customDataForPreview, previewData || {});

      default:
        throw new BadRequestException('Invalid render mode');
    }
  }

  /**
   * Obtiene los datos estáticos de una plantilla
   */
  async getStaticData(templateName: string, category?: TemplateCategory): Promise<TemplateData> {
    FileUtils.validateTemplateName(templateName);
    const { category: resolvedCategory } = await this.resolveTemplateLocation(templateName, category);
    return this.fileStorageService.readTemplateData(templateName, 'static', resolvedCategory);
  }

  /**
   * Obtiene los datos personalizados de una plantilla
   */
  async getCustomData(templateName: string, category?: TemplateCategory): Promise<TemplateData> {
    FileUtils.validateTemplateName(templateName);
    const { category: resolvedCategory } = await this.resolveTemplateLocation(templateName, category);
    return this.fileStorageService.readTemplateData(templateName, 'custom', resolvedCategory);
  }

  /**
   * Guarda los datos personalizados de una plantilla
   */
  async saveCustomData(templateName: string, data: any, category?: TemplateCategory): Promise<void> {
    FileUtils.validateTemplateName(templateName);
    const { path: templatePath, category: resolvedCategory } =
      await this.resolveTemplateLocation(templateName, category);

    // Validar que la plantilla existe
    if (!(await FileUtils.fileExists(templatePath))) {
      throw new NotFoundException(HTTP_MESSAGES.TEMPLATE_NOT_FOUND);
    }

    await this.fileStorageService.writeTemplateData(templateName, 'custom', data, resolvedCategory);
  }

  /**
   * Registra helpers personalizados para Handlebars
   */
  private registerHandlebarsHelpers(): void {
    // Helper para formatear precios
    Handlebars.registerHelper('formatPrice', function(price: number) {
      return new Handlebars.SafeString(`$${price.toFixed(2)}`);
    });

    // Helper para generar enlaces seguros
    Handlebars.registerHelper('safeUrl', function(url: string) {
      if (!url || typeof url !== 'string') return '';
      // Validación básica de URL
      try {
        new URL(url);
        return new Handlebars.SafeString(url);
      } catch {
        return '';
      }
    });

    // Helper para iterar con índice
    Handlebars.registerHelper('eachWithIndex', function(array, options) {
      let result = '';
      if (Array.isArray(array)) {
        for (let i = 0; i < array.length; i++) {
          result += options.fn({ ...array[i], index: i });
        }
      }
      return result;
    });

    // Helper condicional para comparaciones
    Handlebars.registerHelper('ifEquals', function(arg1, arg2, options) {
      return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
    });

    // Helper para truncar texto
    Handlebars.registerHelper('truncate', function(str: string, length: number) {
      if (!str || typeof str !== 'string') return '';
      if (str.length <= length) return str;
      return str.substring(0, length) + '...';
    });

    // Helper para convertir objetos a JSON
    Handlebars.registerHelper('json', function(context) {
      return new Handlebars.SafeString(JSON.stringify(context));
    });

    // Helper para repetir elementos (times)
    Handlebars.registerHelper('times', function(n: number, options) {
      let result = '';
      for (let i = 0; i < n; i++) {
        result += options.fn(this);
      }
      return result;
    });

    // Helper para comparaciones de igualdad (eq)
    Handlebars.registerHelper('eq', function(arg1, arg2, options) {
      return (arg1 === arg2) ? options.fn(this) : options.inverse(this);
    });
  }

  private async resolveTemplateLocation(
    templateName: string,
    category?: TemplateCategory,
  ): Promise<{ path: string; category?: TemplateCategory }> {
    if (category) {
      const path = FileUtils.getTemplatePathByCategory(category, templateName);
      return { path, category };
    }

    // 1) Intento legacy en raíz
    const rootPath = FileUtils.getTemplatePath(templateName);
    if (await FileUtils.fileExists(join(rootPath, TEMPLATE_CONSTANTS.TEMPLATE_FILE))) {
      return { path: rootPath, category: undefined };
    }

    // 2) Intento en categorías
    for (const cat of TEMPLATE_CATEGORIES) {
      const catPath = FileUtils.getTemplatePathByCategory(cat, templateName);
      if (await FileUtils.fileExists(join(catPath, TEMPLATE_CONSTANTS.TEMPLATE_FILE))) {
        return { path: catPath, category: cat };
      }
    }

    // No encontrada; devolvemos raíz para que el flujo de error sea consistente
    return { path: rootPath, category: undefined };
  }
}
