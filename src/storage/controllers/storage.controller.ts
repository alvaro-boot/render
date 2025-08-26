import { Controller, Get, Param } from '@nestjs/common';
import { FileStorageService } from '../services/file-storage.service';

@Controller('storage')
export class StorageController {
  constructor(private readonly fileStorageService: FileStorageService) {}

  /**
   * GET /storage/templates
   * Lista todas las plantillas disponibles
   */
  @Get('templates')
  async listTemplates() {
    const templates = await this.fileStorageService.listTemplates();
    return {
      templates,
      count: templates.length,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * GET /storage/template/:project/info
   * Obtiene información detallada de una plantilla
   */
  @Get('template/:project/info')
  async getTemplateInfo(@Param('project') project: string) {
    const info = await this.fileStorageService.getTemplateInfo(project);
    return {
      project,
      ...info,
      timestamp: new Date().toISOString(),
    };
  }
}