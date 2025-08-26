import { PartialType } from '@nestjs/mapped-types';
import { CreateClientConfigurationDto } from './create-client-configuration.dto';

export class UpdateClientConfigurationDto extends PartialType(CreateClientConfigurationDto) {}
