import { Injectable, NotFoundException } from '@nestjs/common';
import { promises as fs } from 'fs';
import { join } from 'path';
import { FileUtils } from '../../shared/utils/file.utils';
import { TEMPLATE_CONSTANTS, HTTP_MESSAGES, TEMPLATE_CATEGORIES, TemplateCategory } from '../../config/constants';
import { TemplateData } from '../interfaces/storage.interface';

type DataType = 'static' | 'custom';

@Injectable()
export class FileStorageService {
  /**
   * Lee los datos de una plantilla (static o custom)
   */
  async readTemplateData(templateName: string, dataType: DataType, category?: TemplateCategory): Promise<TemplateData> {
    FileUtils.validateTemplateName(templateName);

    const templatePath = category
      ? FileUtils.getTemplatePathByCategory(category, templateName)
      : FileUtils.getTemplatePath(templateName);
    const fileName = dataType === 'static' 
      ? TEMPLATE_CONSTANTS.STATIC_DATA_FILE 
      : TEMPLATE_CONSTANTS.CUSTOM_DATA_FILE;
    
    const filePath = join(templatePath, fileName);

    return await FileUtils.readJsonFile(filePath);
  }

  /**
   * Escribe los datos de una plantilla
   */
  async writeTemplateData(templateName: string, dataType: DataType, data: TemplateData, category?: TemplateCategory): Promise<void> {
    FileUtils.validateTemplateName(templateName);

    const templatePath = category
      ? FileUtils.getTemplatePathByCategory(category, templateName)
      : FileUtils.getTemplatePath(templateName);
    const fileName = dataType === 'static' 
      ? TEMPLATE_CONSTANTS.STATIC_DATA_FILE 
      : TEMPLATE_CONSTANTS.CUSTOM_DATA_FILE;
    
    const filePath = join(templatePath, fileName);

    // Crear directorio si no existe
    await fs.mkdir(templatePath, { recursive: true });

    await FileUtils.writeJsonFile(filePath, data);
  }

  /**
   * Lista todas las plantillas disponibles
   */
  async listTemplates(): Promise<string[]> {
    const viewsPath = join(process.cwd(), TEMPLATE_CONSTANTS.VIEWS_PATH);
    
    try {
      const entries = await fs.readdir(viewsPath, { withFileTypes: true });
      const templates = [];

      for (const entry of entries) {
        if (entry.isDirectory()) {
          const templatePath = join(viewsPath, entry.name);
          const templateFile = join(templatePath, TEMPLATE_CONSTANTS.TEMPLATE_FILE);
          
          // Verificar que tiene el archivo de plantilla
          if (await FileUtils.fileExists(templateFile)) {
            templates.push(entry.name);
          }
        }
      }

      return templates;
    } catch (error) {
      if (error.code === 'ENOENT') {
        return [];
      }
      throw error;
    }
  }

  /**
   * Obtiene información detallada de una plantilla
   */
  async getTemplateInfo(templateName: string, category?: TemplateCategory): Promise<any> {
    FileUtils.validateTemplateName(templateName);

    const templatePath = category
      ? FileUtils.getTemplatePathByCategory(category, templateName)
      : FileUtils.getTemplatePath(templateName);
    const templateFile = join(templatePath, TEMPLATE_CONSTANTS.TEMPLATE_FILE);
    const staticDataFile = join(templatePath, TEMPLATE_CONSTANTS.STATIC_DATA_FILE);
    const customDataFile = join(templatePath, TEMPLATE_CONSTANTS.CUSTOM_DATA_FILE);

    if (!(await FileUtils.fileExists(templateFile))) {
      throw new NotFoundException(HTTP_MESSAGES.TEMPLATE_NOT_FOUND);
    }

    const info = {
      name: templateName,
      category: category ?? null,
      hasTemplate: await FileUtils.fileExists(templateFile),
      hasStaticData: await FileUtils.fileExists(staticDataFile),
      hasCustomData: await FileUtils.fileExists(customDataFile),
      files: [],
    };

    // Obtener información de archivos
    try {
      const files = await fs.readdir(templatePath);
      for (const file of files) {
        const filePath = join(templatePath, file);
        const stats = await fs.stat(filePath);
        info.files.push({
          name: file,
          size: stats.size,
          modified: stats.mtime,
          isDirectory: stats.isDirectory(),
        });
      }
    } catch (error) {
      // Si no se puede leer el directorio, continuar sin la información de archivos
    }

    return info;
  }

  /**
   * Verifica si una plantilla existe
   */
  async templateExists(templateName: string, category?: TemplateCategory): Promise<boolean> {
    try {
      FileUtils.validateTemplateName(templateName);
      const templatePath = category
        ? FileUtils.getTemplatePathByCategory(category, templateName)
        : FileUtils.getTemplatePath(templateName);
      const templateFile = join(templatePath, TEMPLATE_CONSTANTS.TEMPLATE_FILE);
      return await FileUtils.fileExists(templateFile);
    } catch {
      return false;
    }
  }

  /**
   * Lista plantillas por categoría, sólo dentro de categorías válidas
   */
  async listTemplatesByCategory(): Promise<Record<TemplateCategory, string[]>> {
    const viewsPath = join(process.cwd(), TEMPLATE_CONSTANTS.VIEWS_PATH);
    const result = TEMPLATE_CATEGORIES.reduce((acc, cat) => {
      acc[cat] = [];
      return acc;
    }, {} as Record<TemplateCategory, string[]>);

    try {
      for (const category of TEMPLATE_CATEGORIES) {
        const catDir = join(viewsPath, category);
        let entries: any[] = [];
        try {
          entries = await fs.readdir(catDir, { withFileTypes: true });
        } catch {
          continue;
        }
        for (const entry of entries) {
          if (!entry.isDirectory()) continue;
          const templatePath = join(catDir, entry.name);
          const templateFile = join(templatePath, TEMPLATE_CONSTANTS.TEMPLATE_FILE);
          if (await FileUtils.fileExists(templateFile)) {
            result[category].push(entry.name);
          }
        }
      }
    } catch {}

    return result;
  }
}