import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { TemplateService } from '../services/template.service';
import { RenderTemplateDto } from '../dto/render-template.dto';
import { TemplateCategory } from '../../config/constants';

@Controller('template')
export class TemplateController {
  constructor(private readonly templateService: TemplateService) {}


  /**
   * GET /template/:project
   * Renderiza plantilla con static-data.json únicamente
   */
  @Get(':project')
  async renderStaticTemplate(
    @Param('project') project: string,
    @Res() res: Response,
  ) {
    const html = await this.templateService.renderTemplate(project, 'static');
    res.setHeader('Content-Type', 'text/html');
    res.status(HttpStatus.OK).send(html);
  }
  

  /**
   * GET /template/:project/render
   * Renderiza plantilla con static + custom data
   */
  @Get(':project/render')
  async renderFullTemplate(
    @Param('project') project: string,
    @Res() res: Response,
  ) {
    const html = await this.templateService.renderTemplate(project, 'full');
    res.setHeader('Content-Type', 'text/html');
    res.status(HttpStatus.OK).send(html);
  }

  /**
   * POST /template/:project/render
   * Renderiza plantilla con static + custom + body data (sin guardar)
   */
  @Post(':project/render')
  async renderTemplateWithPreview(
    @Param('project') project: string,
    @Body() renderData: RenderTemplateDto,
    @Res() res: Response,
  ) {
    const html = await this.templateService.renderTemplate(
      project,
      'preview',
      renderData.data,
    );
    res.setHeader('Content-Type', 'text/html');
    res.status(HttpStatus.OK).send(html);
  }

  /**
   * PUT /template/:project/custom-data
   * Guarda datos personalizados como custom-data.json
   */
  @Put(':project/custom-data')
  async updateCustomData(
    @Param('project') project: string,
    @Body() customData: any,
  ) {
    await this.templateService.saveCustomData(project, customData);
    return {
      message: 'Custom data saved successfully',
      project,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * GET /template/:project/static-data
   * Devuelve el contenido de static-data.json
   */

  @Get(':project/static-data')
  async getStaticData(@Param('project') project: string) {
    const data = await this.templateService.getStaticData(project);
    return {
      project,
      data,
      timestamp: new Date().toISOString(),
    };
  }


  /**
   * GET /template/:project/custom-data
   * Devuelve el contenido de custom-data.json
   */
  @Get(':project/custom-data')
  async getCustomData(@Param('project') project: string) {
    const data = await this.templateService.getCustomData(project);
    return {
      project,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * GET /template/:category/:project
   * Renderiza plantilla con static-data.json únicamente por categoría
   */
  @Get(':category/:project')
  async renderStaticTemplateByCategory(
    @Param('category') category: TemplateCategory,
    @Param('project') project: string,
    @Res() res: Response,
  ) {
    const html = await this.templateService.renderTemplate(project, 'static', undefined, category);
    res.setHeader('Content-Type', 'text/html');
    res.status(HttpStatus.OK).send(html);
  }

  /**
   * GET /template/:category/:project/render
   * Renderiza plantilla con static + custom data por categoría
   */
  @Get(':category/:project/render')
  async renderFullTemplateByCategory(
    @Param('category') category: TemplateCategory,
    @Param('project') project: string,
    @Res() res: Response,
  ) {
    const html = await this.templateService.renderTemplate(project, 'full', undefined, category);
    res.setHeader('Content-Type', 'text/html');
    res.status(HttpStatus.OK).send(html);
  }

  /**
   * POST /template/:category/:project/render
   * Renderiza plantilla con static + custom + body data (sin guardar) por categoría
   */
  @Post(':category/:project/render')
  async renderTemplateWithPreviewByCategory(
    @Param('category') category: TemplateCategory,
    @Param('project') project: string,
    @Body() renderData: RenderTemplateDto,
    @Res() res: Response,
  ) {
    const html = await this.templateService.renderTemplate(project, 'preview', renderData.data, category);
    res.setHeader('Content-Type', 'text/html');
    res.status(HttpStatus.OK).send(html);
  }

  /**
   * PUT /template/:category/:project/custom-data
   * Guarda datos personalizados como custom-data.json por categoría
   */
  @Put(':category/:project/custom-data')
  async updateCustomDataByCategory(
    @Param('category') category: TemplateCategory,
    @Param('project') project: string,
    @Body() customData: any,
  ) {
    await this.templateService.saveCustomData(project, customData, category);
    return {
      message: 'Custom data saved successfully',
      project,
      category,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * GET /template/:category/:project/static-data
   * Devuelve el contenido de static-data.json por categoría
   */
  @Get(':category/:project/static-data')
  async getStaticDataByCategory(
    @Param('category') category: TemplateCategory,
    @Param('project') project: string,
  ) {
    const data = await this.templateService.getStaticData(project, category);
    return { project, category, data, timestamp: new Date().toISOString() };
  }


  /**
   * GET /template/:category/:project/custom-data
   * Devuelve el contenido de custom-data.json por categoría
   */
  @Get(':category/:project/custom-data')
  async getCustomDataByCategory(
    @Param('category') category: TemplateCategory,
    @Param('project') project: string,
  ) {
    const data = await this.templateService.getCustomData(project, category);
    return { project, category, data, timestamp: new Date().toISOString() };
  }
}