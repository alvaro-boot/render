import { promises as fs } from 'fs';
import { join } from 'path';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { TEMPLATE_CONSTANTS, HTTP_MESSAGES, TEMPLATE_CATEGORIES, TemplateCategory } from '../../config/constants';

export class FileUtils {
  /**
   * Validates template name to prevent path traversal attacks
   */
  static validateTemplateName(templateName: string): void {
    if (!templateName || templateName.length > TEMPLATE_CONSTANTS.MAX_TEMPLATE_NAME_LENGTH) {
      throw new BadRequestException(HTTP_MESSAGES.INVALID_TEMPLATE_NAME);
    }

    if (!TEMPLATE_CONSTANTS.ALLOWED_TEMPLATE_NAME_PATTERN.test(templateName)) {
      throw new BadRequestException(HTTP_MESSAGES.INVALID_TEMPLATE_NAME);
    }

    // Additional security: prevent path traversal
    if (templateName.includes('..') || templateName.includes('/') || templateName.includes('\\')) {
      throw new BadRequestException(HTTP_MESSAGES.INVALID_TEMPLATE_NAME);
    }
  }

  static validateCategory(category: string): asserts category is TemplateCategory {
    if (!TEMPLATE_CATEGORIES.includes(category as TemplateCategory)) {
      throw new BadRequestException('Invalid category');
    }
  }

  /**
   * Gets the template directory path
   */
  static getTemplatePath(templateName: string): string {
    this.validateTemplateName(templateName);
    return join(process.cwd(), TEMPLATE_CONSTANTS.VIEWS_PATH, templateName);
  }

  static getTemplatePathByCategory(category: TemplateCategory, templateName: string): string {
    this.validateCategory(category);
    this.validateTemplateName(templateName);
    return join(process.cwd(), TEMPLATE_CONSTANTS.VIEWS_PATH, category, templateName);
  }

  /**
   * Checks if a file exists
   */
  static async fileExists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Reads and parses JSON file
   */
  static async readJsonFile(filePath: string): Promise<any> {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      if (error.code === 'ENOENT') {
        return {};
      }
      throw new BadRequestException(HTTP_MESSAGES.INVALID_JSON_DATA);
    }
  }

  /**
   * Writes JSON data to file
   */
  static async writeJsonFile(filePath: string, data: any): Promise<void> {
    try {
      const jsonContent = JSON.stringify(data, null, 2);
      await fs.writeFile(filePath, jsonContent, 'utf-8');
    } catch (error) {
      throw new BadRequestException(`Error writing file: ${error.message}`);
    }
  }

  /**
   * Reads template file content
   */
  static async readTemplateFile(filePath: string): Promise<string> {
    try {
      return await fs.readFile(filePath, 'utf-8');
    } catch (error) {
      if (error.code === 'ENOENT') {
        throw new NotFoundException(HTTP_MESSAGES.TEMPLATE_NOT_FOUND);
      }
      throw new BadRequestException(`Error reading template: ${error.message}`);
    }
  }

  /**
   * Reads directory contents
   */
  static async readDirectory(dirPath: string): Promise<string[]> {
    try {
      return await fs.readdir(dirPath);
    } catch (error) {
      if (error.code === 'ENOENT') {
        return [];
      }
      throw new BadRequestException(`Error reading directory: ${error.message}`);
    }
  }

  /**
   * Deletes a file
   */
  static async deleteFile(filePath: string): Promise<void> {
    try {
      await fs.unlink(filePath);
    } catch (error) {
      if (error.code === 'ENOENT') {
        // File doesn't exist, which is fine for deletion
        return;
      }
      throw new BadRequestException(`Error deleting file: ${error.message}`);
    }
  }

  /**
   * Ensures directory exists, creates it if it doesn't
   */
  static async ensureDirectoryExists(dirPath: string): Promise<void> {
    try {
      await fs.mkdir(dirPath, { recursive: true });
    } catch (error) {
      throw new BadRequestException(`Error creating directory: ${error.message}`);
    }
  }

  /**
   * Deep merge objects
   */
  static deepMerge(target: any, ...sources: any[]): any {
    if (!sources.length) return target;
    const source = sources.shift();

    if (this.isObject(target) && this.isObject(source)) {
      for (const key in source) {
        if (this.isObject(source[key])) {
          if (!target[key]) Object.assign(target, { [key]: {} });
          this.deepMerge(target[key], source[key]);
        } else {
          Object.assign(target, { [key]: source[key] });
        }
      }
    }

    return this.deepMerge(target, ...sources);
  }

  private static isObject(item: any): boolean {
    return item && typeof item === 'object' && !Array.isArray(item);
  }
}