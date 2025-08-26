import { 
  Controller, 
  Post, 
  Get, 
  Delete, 
  Param, 
  Query, 
  Res, 
  UseInterceptors, 
  UploadedFile,
  BadRequestException,
  NotFoundException
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { ImageStorageService, UploadedImage } from '../services/image-storage.service';

@Controller('storage/images')
export class ImageStorageController {
  constructor(private readonly imageStorageService: ImageStorageService) {}

  /**
   * POST /storage/images/:clientId/upload
   * Sube una imagen para un cliente específico
   */
  @Post(':clientId/upload')
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(
    @Param('clientId') clientId: string,
    @UploadedFile() file: Express.Multer.File,
    @Query('category') category?: string
  ) {
    try {
      if (!file) {
        throw new BadRequestException('No se proporcionó ningún archivo');
      }

      const image = await this.imageStorageService.uploadImage(clientId, file, category);
      
      return {
        success: true,
        message: 'Imagen subida exitosamente',
        image: {
          id: image.id,
          originalName: image.originalName,
          fileName: image.fileName,
          url: image.url,
          size: image.size,
          mimeType: image.mimeType,
          uploadedAt: image.uploadedAt
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * GET /storage/images/:clientId
   * Obtiene todas las imágenes de un cliente
   */
  @Get(':clientId')
  async getClientImages(
    @Param('clientId') clientId: string,
    @Query('category') category?: string
  ) {
    try {
      const images = await this.imageStorageService.getClientImages(clientId, category);
      
      return {
        success: true,
        clientId,
        count: images.length,
        images: images.map(img => ({
          id: img.id,
          originalName: img.originalName,
          fileName: img.fileName,
          url: img.url,
          size: img.size,
          mimeType: img.mimeType,
          uploadedAt: img.uploadedAt
        }))
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * GET /storage/images/:clientId/:fileName
   * Sirve una imagen específica
   */
  @Get(':clientId/:fileName')
  async serveImage(
    @Param('clientId') clientId: string,
    @Param('fileName') fileName: string,
    @Res() res: Response
  ) {
    try {
      const imageBuffer = await this.imageStorageService.getImageFile(clientId, fileName);

      // Intentar encontrar metadatos; si no existen, construir cabeceras básicas
      let contentType = 'application/octet-stream';
      let contentLength = imageBuffer.length.toString();
      let eTag: string | undefined;

      try {
        const images = await this.imageStorageService.getClientImages(clientId);
        const imageInfo = images.find(img => img.fileName === fileName);
        if (imageInfo) {
          contentType = imageInfo.mimeType;
          contentLength = imageInfo.size.toString();
          eTag = `"${imageInfo.id}"`;
        }
      } catch {}

      // Si no hay metadatos, inferir mime por extensión
      if (contentType === 'application/octet-stream') {
        const ext = (fileName.split('.').pop() || '').toLowerCase();
        const extToMime: Record<string, string> = {
          jpg: 'image/jpeg',
          jpeg: 'image/jpeg',
          png: 'image/png',
          gif: 'image/gif',
          webp: 'image/webp',
          svg: 'image/svg+xml'
        };
        contentType = extToMime[ext] || contentType;
      }

      const headers: Record<string, string> = {
        'Content-Type': contentType,
        'Content-Length': contentLength,
        'Cache-Control': 'public, max-age=31536000'
      };
      if (eTag) headers['ETag'] = eTag;

      res.set(headers);
      res.send(imageBuffer);
    } catch (error) {
      res.status(404).json({
        success: false,
        error: 'Imagen no encontrada'
      });
    }
  }

  /**
   * GET /storage/images/:clientId/image/:imageId
   * Obtiene información de una imagen específica
   */
  @Get(':clientId/image/:imageId')
  async getImageInfo(
    @Param('clientId') clientId: string,
    @Param('imageId') imageId: string
  ) {
    try {
      const image = await this.imageStorageService.getImage(clientId, imageId);
      
      return {
        success: true,
        image: {
          id: image.id,
          originalName: image.originalName,
          fileName: image.fileName,
          url: image.url,
          size: image.size,
          mimeType: image.mimeType,
          uploadedAt: image.uploadedAt
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * DELETE /storage/images/:clientId/image/:imageId
   * Elimina una imagen específica
   */
  @Delete(':clientId/image/:imageId')
  async deleteImage(
    @Param('clientId') clientId: string,
    @Param('imageId') imageId: string
  ) {
    try {
      await this.imageStorageService.deleteImage(clientId, imageId);
      
      return {
        success: true,
        message: 'Imagen eliminada exitosamente'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * DELETE /storage/images/:clientId
   * Elimina todas las imágenes de un cliente
   */
  @Delete(':clientId')
  async deleteClientImages(@Param('clientId') clientId: string) {
    try {
      await this.imageStorageService.deleteClientImages(clientId);
      
      return {
        success: true,
        message: 'Todas las imágenes del cliente han sido eliminadas'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * GET /storage/images/:clientId/stats
   * Obtiene estadísticas de imágenes de un cliente
   */
  @Get(':clientId/stats')
  async getClientImageStats(@Param('clientId') clientId: string) {
    try {
      const stats = await this.imageStorageService.getClientImageStats(clientId);
      
      return {
        success: true,
        stats
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * GET /storage/images/:clientId/categories
   * Obtiene las categorías de imágenes de un cliente
   */
  @Get(':clientId/categories')
  async getClientImageCategories(@Param('clientId') clientId: string) {
    try {
      const images = await this.imageStorageService.getClientImages(clientId);
      const categories = new Set<string>();
      
      images.forEach(img => {
        const pathParts = img.filePath.split('/');
        const categoryIndex = pathParts.findIndex(part => part === 'clients') + 2;
        if (pathParts[categoryIndex]) {
          categories.add(pathParts[categoryIndex]);
        }
      });
      
      return {
        success: true,
        clientId,
        categories: Array.from(categories),
        count: categories.size
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}
