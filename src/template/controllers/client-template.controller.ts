import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Param, 
  Body, 
  Res, 
  HttpStatus,
  Query,
  BadRequestException
} from '@nestjs/common';
import { Response } from 'express';
import { TemplateConfigurationService } from '../services/template-configuration.service';
import { CreateClientConfigurationDto } from '../dto/create-client-configuration.dto';
import { UpdateClientConfigurationDto } from '../dto/update-client-configuration.dto';
import { AVAILABLE_SECTIONS } from '../../config/sections.config';

@Controller('client-templates')
export class ClientTemplateController {
  constructor(
    private readonly templateConfigurationService: TemplateConfigurationService
  ) {}

  /**
   * GET /client-templates/available-sections
   * Obtiene las secciones disponibles
   */
  @Get('available-sections')
  async getAvailableSections() {
    return {
      sections: AVAILABLE_SECTIONS,
      categories: {
        content: 'Contenido',
        commerce: 'Comercio',
        social: 'Social',
        contact: 'Contacto'
      }
    };
  }

  /**
   * GET /client-templates/:clientId
   * Renderiza la plantilla de un cliente específico
   */
  @Get(':clientId')
  async renderClientTemplate(
    @Param('clientId') clientId: string,
    @Res() res: Response,
    @Query('multiPage') multiPage?: string
  ) {
    try {
      if (multiPage && (multiPage === '1' || multiPage.toLowerCase() === 'true')) {
        // Redirigir al índice multipágina
        return res.redirect(`/api/v1/client-templates/${clientId}/pages`);
      }
      const html = await this.templateConfigurationService.renderClientTemplate(clientId);
      res.setHeader('Content-Type', 'text/html');
      res.status(HttpStatus.OK).send(html);
    } catch (error) {
      res.status(HttpStatus.NOT_FOUND).json({
        message: error.message
      });
    }
  }

  /**
   * GET /client-templates/:clientId/pages
   * Renderiza índice multipágina con enlaces por sección
   */
  @Get(':clientId/pages')
  async renderClientMultipageIndex(
    @Param('clientId') clientId: string,
    @Res() res: Response
  ) {
    try {
      const html = await this.templateConfigurationService.renderClientMultipageIndex(clientId);
      res.setHeader('Content-Type', 'text/html');
      res.status(HttpStatus.OK).send(html);
    } catch (error) {
      res.status(HttpStatus.NOT_FOUND).json({
        message: error.message
      });
    }
  }

  /**
   * GET /client-templates/:clientId/section/:sectionId
   * Renderiza una sección específica del cliente como página independiente
   */
  @Get(':clientId/section/:sectionId')
  async renderClientSection(
    @Param('clientId') clientId: string,
    @Param('sectionId') sectionId: string,
    @Res() res: Response
  ) {
    try {
      const html = await this.templateConfigurationService.renderClientSection(clientId, sectionId);
      res.setHeader('Content-Type', 'text/html');
      res.status(HttpStatus.OK).send(html);
    } catch (error) {
      res.status(HttpStatus.NOT_FOUND).json({
        message: error.message
      });
    }
  }

  /**
   * GET /client-templates/:clientId/all-sections-data
   * Obtiene todos los datos de todas las secciones del cliente (habilitadas y deshabilitadas)
   */
  @Get(':clientId/all-sections-data')
  async getAllSectionsData(
    @Param('clientId') clientId: string,
    @Res() res: Response
  ) {
    try {
      const config = await this.templateConfigurationService.getClientConfiguration(clientId);
      const uploadedImages = await this.templateConfigurationService['imageStorageService'].getClientImages(clientId);
      
      // Procesar todas las secciones con sus datos
      const allSections = config.sections
        .sort((a, b) => a.order - b.order)
        .map(section => ({
          id: section.id,
          name: section.id, // SectionConfiguration no tiene name, usar id
          enabled: section.enabled,
          order: section.order,
          data: section.data
        }));

      res.status(HttpStatus.OK).json({
        clientId,
        company: config.company,
        style: config.style,
        theme: config.theme,
        sections: allSections,
        uploadedImages: uploadedImages.map(img => ({
          filename: img.fileName, // Cambiar filename por fileName
          url: img.url,
          originalName: img.originalName
        }))
      });
    } catch (error) {
      res.status(HttpStatus.NOT_FOUND).json({
        message: error.message
      });
    }
  }

  /**
   * GET /client-templates/:clientId/pages-info
   * Obtiene información sobre las páginas disponibles del cliente
   */
  @Get(':clientId/pages-info')
  async getClientPagesInfo(
    @Param('clientId') clientId: string
  ) {
    try {
      const config = await this.templateConfigurationService.getClientConfiguration(clientId);
      
      // Obtener solo las secciones habilitadas
      const enabledSections = config.sections
        .filter(section => section.enabled)
        .sort((a, b) => a.order - b.order);
      
      const pages = enabledSections.map(section => ({
        id: section.id,
        name: this.getSectionDisplayName(section.id),
        order: section.order,
        url: `/api/v1/client-templates/${clientId}/section/${section.id}`,
        description: this.getSectionDescription(section.id)
      }));

      return {
        clientId,
        clientName: config.name,
        style: config.style,
        totalPages: pages.length,
        pages: pages,
        indexUrl: `/api/v1/client-templates/${clientId}/pages`,
        fullSiteUrl: `/api/v1/client-templates/${clientId}`,
        configurationUrl: `/api/v1/client-templates/${clientId}/configuration`
      };
    } catch (error) {
      throw new BadRequestException(`Error getting pages info: ${error.message}`);
    }
  }

  /**
   * Obtiene el nombre de visualización de una sección
   */
  private getSectionDisplayName(sectionId: string): string {
    const displayNames = {
      hero: "Inicio",
      about: "Nosotros",
      products: "Productos",
      services: "Servicios",
      testimonials: "Testimonios",
      gallery: "Galería",
      contact: "Contacto",
      cart: "Carrito",
      appointments: "Citas",
      stats: "Estadísticas"
    };
    return displayNames[sectionId] || sectionId;
  }

  /**
   * Obtiene la descripción de una sección
   */
  private getSectionDescription(sectionId: string): string {
    const descriptions = {
      hero: "Página principal con información destacada de la empresa",
      about: "Conoce más sobre nosotros y nuestra historia",
      products: "Explora nuestro catálogo de productos",
      services: "Descubre los servicios que ofrecemos",
      testimonials: "Opiniones y experiencias de nuestros clientes",
      gallery: "Galería de imágenes de nuestros trabajos",
      contact: "Información de contacto y formularios",
      cart: "Carrito de compras y gestión de pedidos",
      appointments: "Reserva de citas y agendamiento",
      stats: "Estadísticas y logros de la empresa"
    };
    return descriptions[sectionId] || "Contenido personalizado de la sección";
  }

  /**
   * POST /client-templates/:clientId/render
   * Renderiza la plantilla con datos personalizados (sin guardar)
   */
  @Post(':clientId/render')
  async renderClientTemplateWithData(
    @Param('clientId') clientId: string,
    @Body() customData: any,
    @Res() res: Response
  ) {
    try {
      const html = await this.templateConfigurationService.renderClientTemplate(clientId, customData);
      res.setHeader('Content-Type', 'text/html');
      res.status(HttpStatus.OK).send(html);
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({
        message: error.message
      });
    }
  }

  /**
   * POST /client-templates
   * Crea una nueva configuración de cliente
   */
  @Post()
  async createClientConfiguration(
    @Body() createConfigDto: CreateClientConfigurationDto
  ) {
    const selectedSections = createConfigDto.sections
      .filter(section => section.enabled)
      .map(section => section.id);

    const config = await this.templateConfigurationService.createClientConfiguration(
      createConfigDto.clientId,
      selectedSections,
      createConfigDto.style,
      createConfigDto.company,
      createConfigDto.sections.reduce((acc, section) => {
        if (section.data) {
          acc[section.id] = section.data;
        }
        return acc;
      }, {})
    );

    return {
      message: 'Client configuration created successfully',
      config
    };
  }

  /**
   * GET /client-templates/:clientId/configuration
   * Obtiene la configuración de un cliente
   */
  @Get(':clientId/configuration')
  async getClientConfiguration(
    @Param('clientId') clientId: string
  ) {
    const config = await this.templateConfigurationService.getClientConfiguration(clientId);
    return config;
  }

  /**
   * PUT /client-templates/:clientId/configuration
   * Actualiza la configuración de un cliente
   */
  @Put(':clientId/configuration')
  async updateClientConfiguration(
    @Param('clientId') clientId: string,
    @Body() updateConfigDto: UpdateClientConfigurationDto
  ) {
    await this.templateConfigurationService.updateClientConfiguration(clientId, updateConfigDto);
    return {
      message: 'Client configuration updated successfully'
    };
  }

  /**
   * GET /client-templates
   * Lista todas las configuraciones de clientes
   */
  @Get()
  async listClientConfigurations(
    @Query('includeDisabled') includeDisabled?: boolean
  ) {
    const configs = await this.templateConfigurationService.listClientConfigurations();
    
    if (includeDisabled) {
      return configs;
    }
    
    // Solo devolver configuraciones activas (con al menos una sección habilitada)
    return configs.filter(config => 
      config.sections.some(section => section.enabled)
    );
  }

  /**
   * DELETE /client-templates/:clientId
   * Elimina la configuración de un cliente
   */
  @Delete(':clientId')
  async deleteClientConfiguration(
    @Param('clientId') clientId: string
  ) {
    await this.templateConfigurationService.deleteClientConfiguration(clientId);
    return {
      message: 'Client configuration deleted successfully'
    };
  }

  /**
   * GET /client-templates/:clientId/preview
   * Previsualiza la plantilla con datos de ejemplo
   */
  @Get(':clientId/preview')
  async previewClientTemplate(
    @Param('clientId') clientId: string,
    @Res() res: Response
  ) {
    try {
      const config = await this.templateConfigurationService.getClientConfiguration(clientId);
      
      // Datos de ejemplo para previsualización
      const previewData = {
        hero: {
          title: config.company.name,
          subtitle: config.company.tagline,
          backgroundImage: "/images/hero-bg.jpg",
          ctaButtons: [
            { text: "Ver Productos", href: "#products", style: "primary" },
            { text: "Contactar", href: "#contact", style: "outline" }
          ]
        },
        about: {
          title: "Sobre Nosotros",
          content: [
            "Somos una empresa comprometida con la excelencia y la satisfacción del cliente.",
            "Nuestro equipo trabaja arduamente para ofrecer los mejores productos y servicios."
          ],
          image: "/images/about.jpg",
          imageAlt: "Sobre nosotros"
        },
        products: {
          title: "Nuestros Productos",
          subtitle: "Descubre nuestra colección única",
          featuredProducts: [
            {
              name: "Producto Destacado 1",
              description: "Descripción del producto destacado",
              price: 99.99,
              image: "/images/product1.jpg",
              imageAlt: "Producto 1",
              category: "Categoría 1",
              features: ["Característica 1", "Característica 2"]
            }
          ],
          categories: []
        },
        cart: {
          title: "Carrito de Compras",
          subtitle: "Revisa tus productos seleccionados",
          items: [
            {
              name: "Producto de Ejemplo",
              description: "Descripción del producto",
              price: 49.99,
              quantity: 1,
              image: "/images/product-example.jpg"
            }
          ],
          subtotal: "49.99",
          shipping: "5.00",
          taxes: "2.50",
          total: "57.49"
        },
        appointments: {
          title: "Reserva tu Cita",
          subtitle: "Agenda una consulta personalizada",
          availableSlots: [
            "09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM"
          ]
        }
      };

      const html = await this.templateConfigurationService.renderClientTemplate(clientId, previewData);
      res.setHeader('Content-Type', 'text/html');
      res.status(HttpStatus.OK).send(html);
    } catch (error) {
      res.status(HttpStatus.NOT_FOUND).json({
        message: error.message
      });
    }
  }

  /**
   * GET /client-templates/diagnostic
   * Endpoint de diagnóstico para verificar el estado del sistema
   */
  @Get('diagnostic')
  async diagnostic(): Promise<any> {
    try {
      const configs = await this.templateConfigurationService.listClientConfigurations();
      const availableConfigs = configs.filter(config => 
        config.sections.some(section => section.enabled)
      );

      return {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        totalConfigurations: configs.length,
        activeConfigurations: availableConfigs.length,
        sampleConfigurations: availableConfigs.slice(0, 3).map(config => ({
          clientId: config.clientId,
          name: config.name,
          style: config.style,
          enabledSections: config.sections.filter(s => s.enabled).map(s => s.id)
        })),
        systemInfo: {
          nodeVersion: process.version,
          platform: process.platform,
          memoryUsage: process.memoryUsage(),
          uptime: process.uptime()
        }
      };
    } catch (error) {
      return {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: error.message
      };
    }
  }

  /**
   * GET /client-templates/:clientId/test-render
   * Endpoint de prueba para verificar el renderizado de secciones
   */
  @Get(':clientId/test-render')
  async testRender(@Param('clientId') clientId: string): Promise<any> {
    try {
      const config = await this.templateConfigurationService.getClientConfiguration(clientId);
      const uploadedImages = await this.templateConfigurationService['imageStorageService'].getClientImages(clientId);
      
      // Obtener solo las secciones habilitadas
      const enabledSections = config.sections
        .filter(section => section.enabled)
        .sort((a, b) => a.order - b.order);
      
      return {
        success: true,
        clientId,
        clientName: config.name,
        style: config.style,
        totalSections: config.sections.length,
        enabledSections: enabledSections.length,
        sections: enabledSections.map(section => ({
          id: section.id,
          order: section.order,
          title: section.data?.title || 'Sin título',
          hasData: !!section.data,
          dataKeys: section.data ? Object.keys(section.data) : [],
          imageFields: section.data ? this.findImageFields(section.data) : []
        })),
        uploadedImages: uploadedImages.length,
        imageDetails: uploadedImages.map(img => ({
          originalName: img.originalName,
          fileName: img.fileName,
          url: img.url
        }))
      };
    } catch (error) {
      throw new BadRequestException(`Error testing render: ${error.message}`);
    }
  }

  /**
   * Encuentra campos de imagen en los datos de una sección
   */
  private findImageFields(data: any, prefix = ''): string[] {
    const imageFields: string[] = [];
    const imageKeys = ['image', 'src', 'logo', 'favicon', 'backgroundImage', 'avatar'];
    
    for (const [key, value] of Object.entries(data)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      
      if (typeof value === 'string' && imageKeys.includes(key)) {
        imageFields.push(fullKey);
      } else if (Array.isArray(value)) {
        value.forEach((item, index) => {
          if (typeof item === 'object' && item !== null) {
            imageFields.push(...this.findImageFields(item, `${fullKey}[${index}]`));
          }
        });
      } else if (typeof value === 'object' && value !== null) {
        imageFields.push(...this.findImageFields(value, fullKey));
      }
    }
    
    return imageFields;
  }
}
