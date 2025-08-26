import { Module } from '@nestjs/common';
import { StorageController } from './controllers/storage.controller';
import { ImageStorageController } from './controllers/image-storage.controller';
import { FileStorageService } from './services/file-storage.service';
import { ImageStorageService } from './services/image-storage.service';

@Module({
  controllers: [StorageController, ImageStorageController],
  providers: [FileStorageService, ImageStorageService],
  exports: [FileStorageService, ImageStorageService],
})
export class StorageModule {}