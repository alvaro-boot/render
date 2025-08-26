import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { promises as fs } from 'fs';
import { join } from 'path';
import { createWriteStream } from 'fs';
import { Readable } from 'stream';
import { v4 as uuidv4 } from 'uuid';

export interface UploadedImage {
  id: string;
  originalName: string;
  fileName: string;
  filePath: string;
  url: string;
  size: number;
  mimeType: string;
  uploadedAt: Date;
  clientId: string;
}

export interface ImageUploadResult {
  success: boolean;
  image?: UploadedImage;
  error?: string;
}

@Injectable()
export class ImageStorageService {
  private readonly uploadsDir = join(process.cwd(), 'uploads');
  private readonly maxFileSize = 5 * 1024 * 1024; // 5MB
  private readonly allowedMimeTypes = [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml'
  ];

  constructor() {
    this.ensureUploadsDirectory();
  }

  /**
   * Asegura que el directorio de uploads existe
   */
  private async ensureUploadsDirectory(): Promise<void> {
    try {
      await fs.mkdir(this.uploadsDir, { recursive: true });
    } catch (error) {
      console.error('Error creating uploads directory:', error);
    }
  }

  /**
   * Obtiene la ruta del directorio de un cliente
   */
  private getClientDirectory(clientId: string): string {
    return join(this.uploadsDir, 'clients', clientId);
  }

  /**
   * Obtiene la URL pública de una imagen
   */
  private getImageUrl(clientId: string, fileName: string): string {
    return `/api/v1/storage/images/${clientId}/${fileName}`;
  }

  /**
   * Valida el archivo de imagen
   */
  private validateImageFile(file: Express.Multer.File): void {
    if (!file) {
      throw new BadRequestException('No se proporcionó ningún archivo');
    }

    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `Tipo de archivo no permitido. Tipos permitidos: ${this.allowedMimeTypes.join(', ')}`
      );
    }

    if (file.size > this.maxFileSize) {
      throw new BadRequestException(
        `El archivo es demasiado grande. Tamaño máximo: ${this.maxFileSize / 1024 / 1024}MB`
      );
    }
  }

  /**
   * Sube una imagen para un cliente específico
   */
  async uploadImage(
    clientId: string, 
    file: Express.Multer.File,
    category?: string
  ): Promise<UploadedImage> {
    this.validateImageFile(file);

    // Crear directorio del cliente si no existe
    const clientDir = this.getClientDirectory(clientId);
    await fs.mkdir(clientDir, { recursive: true });

    // Crear subdirectorio por categoría si se especifica
    const uploadDir = category ? join(clientDir, category) : clientDir;
    await fs.mkdir(uploadDir, { recursive: true });

    // Generar nombre único para el archivo
    const fileExtension = file.originalname.split('.').pop();
    const uniqueFileName = `${uuidv4()}.${fileExtension}`;
    const filePath = join(uploadDir, uniqueFileName);

    // Guardar el archivo
    await this.saveFile(file.buffer, filePath);

    // Crear objeto de imagen
    const image: UploadedImage = {
      id: uuidv4(),
      originalName: file.originalname,
      fileName: uniqueFileName,
      filePath: filePath,
      url: this.getImageUrl(clientId, uniqueFileName),
      size: file.size,
      mimeType: file.mimetype,
      uploadedAt: new Date(),
      clientId: clientId
    };

    // Guardar metadatos de la imagen
    await this.saveImageMetadata(clientId, image);

    return image;
  }

  /**
   * Guarda el archivo en el sistema de archivos
   */
  private async saveFile(buffer: Buffer, filePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const writeStream = createWriteStream(filePath);
      const readable = new Readable();
      
      readable.push(buffer);
      readable.push(null);
      
      readable.pipe(writeStream);
      
      writeStream.on('finish', () => resolve());
      writeStream.on('error', (error) => reject(error));
    });
  }

  /**
   * Guarda los metadatos de la imagen
   */
  private async saveImageMetadata(clientId: string, image: UploadedImage): Promise<void> {
    const metadataPath = join(this.getClientDirectory(clientId), 'images-metadata.json');
    
    try {
      const existingData = await fs.readFile(metadataPath, 'utf-8');
      const metadata = JSON.parse(existingData);
      metadata.images = metadata.images || [];
      metadata.images.push(image);
      await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2));
    } catch (error) {
      // Si el archivo no existe, crear uno nuevo
      const metadata = {
        clientId,
        images: [image],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2));
    }
  }

  /**
   * Obtiene todas las imágenes de un cliente
   */
  async getClientImages(clientId: string, category?: string): Promise<UploadedImage[]> {
    const metadataPath = join(this.getClientDirectory(clientId), 'images-metadata.json');
    
    try {
      const data = await fs.readFile(metadataPath, 'utf-8');
      const metadata = JSON.parse(data);
      
      if (category) {
        const normalizedCategory = category.replace(/\\/g, '/');
        return metadata.images.filter((img: UploadedImage) => {
          const normalizedPath = String(img.filePath).replace(/\\/g, '/');
          return normalizedPath.includes(`/clients/${clientId}/${normalizedCategory}/`);
        });
      }
      
      return metadata.images || [];
    } catch (error) {
      if (error.code === 'ENOENT') {
        return [];
      }
      throw error;
    }
  }

  /**
   * Obtiene una imagen específica por ID
   */
  async getImage(clientId: string, imageId: string): Promise<UploadedImage> {
    const images = await this.getClientImages(clientId);
    const image = images.find(img => img.id === imageId);
    
    if (!image) {
      throw new NotFoundException('Imagen no encontrada');
    }
    
    return image;
  }

  /**
   * Obtiene el archivo de imagen del sistema de archivos
   */
  async getImageFile(clientId: string, fileName: string): Promise<Buffer> {
    const clientDir = this.getClientDirectory(clientId);

    // 1) Intento directo en raíz del cliente
    let candidatePaths: string[] = [join(clientDir, fileName)];

    // 2) Intento en subdirectorios (categorías) si no está en raíz
    try {
      const entries = await fs.readdir(clientDir, { withFileTypes: true });
      const categoryDirs = entries.filter(e => e.isDirectory()).map(d => d.name);
      for (const category of categoryDirs) {
        candidatePaths.push(join(clientDir, category, fileName));
      }
    } catch {}

    for (const pathCandidate of candidatePaths) {
      try {
        return await fs.readFile(pathCandidate);
      } catch (error) {
        if (error.code !== 'ENOENT') {
          throw error;
        }
      }
    }

    throw new NotFoundException('Archivo de imagen no encontrado');
  }

  /**
   * Elimina una imagen
   */
  async deleteImage(clientId: string, imageId: string): Promise<void> {
    const image = await this.getImage(clientId, imageId);
    
    // Eliminar archivo físico
    try {
      await fs.unlink(image.filePath);
    } catch (error) {
      console.error('Error deleting image file:', error);
    }
    
    // Actualizar metadatos
    const metadataPath = join(this.getClientDirectory(clientId), 'images-metadata.json');
    const data = await fs.readFile(metadataPath, 'utf-8');
    const metadata = JSON.parse(data);
    
    metadata.images = metadata.images.filter((img: UploadedImage) => img.id !== imageId);
    metadata.updatedAt = new Date().toISOString();
    
    await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2));
  }

  /**
   * Elimina todas las imágenes de un cliente
   */
  async deleteClientImages(clientId: string): Promise<void> {
    const clientDir = this.getClientDirectory(clientId);
    
    try {
      await fs.rm(clientDir, { recursive: true, force: true });
    } catch (error) {
      console.error('Error deleting client images directory:', error);
    }
  }

  /**
   * Obtiene estadísticas de imágenes de un cliente
   */
  async getClientImageStats(clientId: string): Promise<any> {
    const images = await this.getClientImages(clientId);
    
    const totalSize = images.reduce((sum, img) => sum + img.size, 0);
    const mimeTypes = [...new Set(images.map(img => img.mimeType))];
    
    return {
      clientId,
      totalImages: images.length,
      totalSize,
      totalSizeMB: (totalSize / 1024 / 1024).toFixed(2),
      mimeTypes,
      categories: this.getImageCategories(images),
      lastUpload: images.length > 0 ? 
        new Date(Math.max(...images.map(img => new Date(img.uploadedAt).getTime()))) : 
        null
    };
  }

  /**
   * Obtiene las categorías de imágenes
   */
  private getImageCategories(images: UploadedImage[]): string[] {
    const categories = new Set<string>();
    
    images.forEach(img => {
      const pathParts = img.filePath.split('/');
      const categoryIndex = pathParts.findIndex(part => part === 'clients') + 2;
      if (pathParts[categoryIndex]) {
        categories.add(pathParts[categoryIndex]);
      }
    });
    
    return Array.from(categories);
  }

  /**
   * Valida que una imagen existe
   */
  async imageExists(clientId: string, imageId: string): Promise<boolean> {
    try {
      await this.getImage(clientId, imageId);
      return true;
    } catch {
      return false;
    }
  }
}
