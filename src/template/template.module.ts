import { Module } from '@nestjs/common';
import { TemplateController } from './controllers/template.controller';
import { ClientTemplateController } from './controllers/client-template.controller';
import { TemplateService } from './services/template.service';
import { TemplateConfigurationService } from './services/template-configuration.service';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [StorageModule],
  controllers: [TemplateController, ClientTemplateController],
  providers: [TemplateService, TemplateConfigurationService],
  exports: [TemplateService, TemplateConfigurationService],
})
export class TemplateModule {}