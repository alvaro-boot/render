import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { join } from 'path';
import * as Handlebars from 'handlebars';
import { FileUtils } from '../../shared/utils/file.utils';
import { ClientConfiguration, SectionConfiguration } from '../interfaces/section.interface';
import { AVAILABLE_SECTIONS } from '../../config/sections.config';
import { ImageStorageService, UploadedImage } from '../../storage/services/image-storage.service';

@Injectable()
export class TemplateConfigurationService {
  constructor(private readonly imageStorageService: ImageStorageService) {}
  
  /**
   * Asigna imágenes a galería que tengan URLs de placeholder o estén vacías
   */
  private assignImagesToGallery(images: any[], uploadedImages: UploadedImage[]): any[] {
    if (!images || !Array.isArray(images) || uploadedImages.length === 0) {
      return images;
    }

    return images.map((image, index) => {
      const updatedImage = { ...image };
      
      // Si la imagen está vacía, es un placeholder o es una URL de blob
      if (!updatedImage.src || 
          updatedImage.src === '' || 
          updatedImage.src.startsWith('/images/') ||
          updatedImage.src.startsWith('blob:')) {
        
        // Usar una imagen diferente para cada elemento de galería, ciclando a través de las disponibles
        const imageIndex = index % uploadedImages.length;
        updatedImage.src = uploadedImages[imageIndex].url;
      }
      
      return updatedImage;
    });
  }

  /**
   * Asigna imágenes a testimonios que tengan URLs de placeholder o estén vacías
   */
  private assignImagesToTestimonials(testimonials: any[], uploadedImages: UploadedImage[]): any[] {
    if (!testimonials || !Array.isArray(testimonials) || uploadedImages.length === 0) {
      return testimonials;
    }

    return testimonials.map((testimonial, index) => {
      const updatedTestimonial = { ...testimonial };
      
      // Si la imagen está vacía, es un placeholder o es una URL de blob
      if (!updatedTestimonial.image || 
          updatedTestimonial.image === '' || 
          updatedTestimonial.image.startsWith('/images/') ||
          updatedTestimonial.image.startsWith('blob:')) {
        
        // Usar una imagen diferente para cada testimonio, ciclando a través de las disponibles
        const imageIndex = index % uploadedImages.length;
        updatedTestimonial.image = uploadedImages[imageIndex].url;
      }
      
      return updatedTestimonial;
    });
  }

  /**
   * Asigna imágenes a productos que no tienen imagen
   */
  private assignImagesToProducts(products: any[], uploadsCache: UploadedImage[]): any[] {
    if (!products || !Array.isArray(products) || !uploadsCache || uploadsCache.length === 0) {
      return products;
    }

    return products.map((product, index) => {
      // Si el producto ya tiene una imagen válida, mantenerla
      if (product.image && product.image.trim() !== '' && !product.image.startsWith('blob:')) {
        return product;
      }

      // Buscar una imagen apropiada para el producto
      let assignedImage = uploadsCache[0].url; // fallback a la primera imagen

      // Intentar encontrar una imagen que coincida con el nombre del producto
      const productName = product.name?.toLowerCase() || '';
      const matchingImage = uploadsCache.find(img => 
        img.originalName.toLowerCase().includes(productName) ||
        productName.includes(img.originalName.toLowerCase().split('.')[0])
      );

      if (matchingImage) {
        assignedImage = matchingImage.url;
      } else {
        // Si no hay coincidencia, usar una imagen diferente para cada producto
        const imageIndex = index % uploadsCache.length;
        assignedImage = uploadsCache[imageIndex].url;
      }

      return {
        ...product,
        image: assignedImage
      };
    });
  }

  /**
   * Procesa las imágenes en los datos de configuración
   */
  private async processImagesInData(
    data: any,
    clientId: string,
    uploadsCache?: UploadedImage[]
  ): Promise<any> {
    if (data === null || data === undefined) {
      return data;
    }

    // Manejo de arrays: preservar tipo y procesar recursivamente
    if (Array.isArray(data)) {
      const processedArray = await Promise.all(
        data.map(item => this.processImagesInData(item, clientId, uploadsCache))
      );
      return processedArray;
    }

    // Si no es objeto, devolver tal cual
    if (typeof data !== 'object') {
      return data;
    }

    // Copiar objeto superficialmente
    const processedData: Record<string, any> = { ...data };

    // Procesar campos de imagen comunes
    const imageFields = ['logo', 'favicon', 'backgroundImage', 'image', 'src'];

    for (const field of imageFields) {
      const value = processedData[field];

      // Si está vacío, usar imagen subida como fallback
      if ((value === undefined || value === null || (typeof value === 'string' && value.trim() === '')) && uploadsCache && uploadsCache.length > 0) {
        processedData[field] = uploadsCache[0].url;
        continue;
      }

      if (value && typeof value === 'string') {
        // Manejar URLs de blob - convertirlas a rutas de archivo
        if (value.startsWith('blob:http://') || value.startsWith('blob:https://')) {
          // Extraer el ID del blob de la URL
          const blobId = value.split('/').pop();
          if (blobId && uploadsCache && uploadsCache.length > 0) {
            // Buscar la imagen correspondiente en el cache
            let matchingImage = uploadsCache.find(img => 
              img.fileName.includes(blobId) || 
              img.originalName.includes(blobId) ||
              img.url.includes(blobId)
            );
            
            // Si no se encuentra por ID, intentar por nombre original
            if (!matchingImage) {
              // Mapear nombres comunes de archivos
              const nameMappings: Record<string, string[]> = {
                'logo': ['logo', 'banner', 'banere', 'alvaro'],
                'favicon': ['favicon', 'icon', 'logo'],
                'backgroundImage': ['banner', 'background', 'hero', 'banere'],
                'image': ['arandano', 'descarga', 'alvaro', 'banere']
              };
              
              const fieldMappings = nameMappings[field] || ['arandano', 'descarga', 'alvaro', 'banere'];
              
              matchingImage = uploadsCache.find(img => 
                fieldMappings.some(name => 
                  img.originalName.toLowerCase().includes(name.toLowerCase())
                )
              );
            }
            
            if (matchingImage) {
              processedData[field] = matchingImage.url;
            } else {
              // Si no se encuentra, usar la primera imagen disponible como fallback
              processedData[field] = uploadsCache[0].url;
            }
          } else if (uploadsCache && uploadsCache.length > 0) {
            // Fallback a la primera imagen disponible
            processedData[field] = uploadsCache[0].url;
          } else {
            // Si no hay imágenes disponibles, usar un placeholder o mantener el valor original
            processedData[field] = value;
          }
          continue;
        }

        if (value.startsWith('/api/v1/storage/images/')) {
          processedData[field] = value; // dejar como relativo para evitar problemas de puerto/host
          continue;
        }

        // Si el valor parece ser solo un nombre de archivo (uuid.ext), construir la ruta pública
        // Esto cubre casos donde se almacena únicamente el fileName de una imagen subida
        const fileNameLike = /^[0-9a-fA-F-]{8,}\.\w{2,}$/;
        if (fileNameLike.test(value)) {
          processedData[field] = `/api/v1/storage/images/${clientId}/${value}`;
          continue;
        }

        // Reemplazo de placeholders de ejemplo (/images/...) por una imagen subida del cliente
        if (value.startsWith('/images/') && uploadsCache && uploadsCache.length > 0) {
          processedData[field] = uploadsCache[0].url; // usar la primera imagen disponible como fallback
          continue;
        } else if (value.startsWith('/images/')) {
          // Si no hay imágenes disponibles, mantener el placeholder
          processedData[field] = value;
          continue;
        }
      }
    }

    // Procesar arrays (como productos, servicios, etc.)
    if (Array.isArray(processedData)) {
      return await Promise.all(processedData.map(item => this.processImagesInData(item, clientId)));
    }

    // Procesar objetos anidados
    for (const key in processedData) {
      if (processedData[key] && typeof processedData[key] === 'object') {
        processedData[key] = await this.processImagesInData(processedData[key], clientId, uploadsCache);
      }
    }

    return processedData;
  }

  /**
   * Renderiza la plantilla de un cliente específico
   */
  async renderClientTemplate(clientId: string, customData?: any): Promise<string> {
    try {
      console.log(`🎨 Rendering template for client: ${clientId}`);
      
      // 1. Cargar configuración del cliente
      const config = await this.loadClientConfiguration(clientId);
      console.log(`📋 Configuration loaded for client: ${clientId}, style: ${config.style}`);
      
      // 1.1. Cachear imágenes subidas del cliente para este renderizado
      const uploadedImages: UploadedImage[] = await this.imageStorageService.getClientImages(clientId);
      console.log(`🖼️ Found ${uploadedImages.length} uploaded images for client: ${clientId}`);
      
      // 2. Cargar layout según estilo
      const layoutTemplate = await this.loadLayoutTemplateForStyle(config.style);
      console.log(`📄 Layout template loaded: ${config.style}`);
      
      // 3. Procesar SOLO las secciones habilitadas (ordenadas)
      const enabledSections = config.sections
        .filter(section => section.enabled)
        .sort((a, b) => a.order - b.order);
      
      console.log(`✅ Processing ${enabledSections.length} enabled sections:`, enabledSections.map(s => s.id));
      
      // 4. Fusionar datos estáticos con personalizados
      // Procesar imágenes en los datos
      const processedCompany = await this.processImagesInData(config.company, clientId, uploadedImages);
      
      // Procesar SOLO las secciones habilitadas para renderizado
      const processedSections = await Promise.all(
        enabledSections.map(async (section) => {
          console.log(`🔄 Processing section: ${section.id}`);
          const processedSection = {
            ...section,
            data: await this.processImagesInData(section.data, clientId, uploadedImages)
          };

          // Asignar imágenes a productos si es una sección de productos
          if (section.id === 'products' && processedSection.data.products) {
            processedSection.data.products = this.assignImagesToProducts(
              processedSection.data.products, 
              uploadedImages
            );
          }

          // Asignar imágenes a testimonios si es una sección de testimonios
          if (section.id === 'testimonials' && processedSection.data.reviews) {
            processedSection.data.reviews = this.assignImagesToTestimonials(
              processedSection.data.reviews, 
              uploadedImages
            );
          }

          // Asignar imágenes a galería si es una sección de galería
          if (section.id === 'gallery' && processedSection.data.images) {
            processedSection.data.images = this.assignImagesToGallery(
              processedSection.data.images, 
              uploadedImages
            );
          }

          return processedSection;
        })
      );

      // 4.1 Procesar también datos personalizados (si existen) para normalizar imágenes
      const processedCustomData = customData
        ? await this.processImagesInData(customData, clientId, uploadedImages)
        : undefined;

      const mergedData = {
        company: processedCompany,
        style: config.style,
        theme: config.theme,
        sections: processedSections, // SOLO secciones habilitadas para renderizado
        allSections: processedSections, // Mismo array para compatibilidad
        footer: this.generateFooterData(config),
        navigation: this.generateNavigationData(enabledSections),
        currentYear: new Date().getFullYear(),
        clientId,
        ...processedCustomData
      };
      
      console.log(`📊 Merged data prepared with ${processedSections.length} sections`);
      
      // 5. Registrar partials
      await this.registerPartials();
      console.log(`📝 Partials registered successfully`);
      
      // 6. Renderizar
      const template = Handlebars.compile(layoutTemplate);
      const html = template(mergedData);
      
      console.log(`✅ Template rendered successfully for client: ${clientId}`);
      return html;
    } catch (error) {
      console.error(`❌ Error rendering template for client ${clientId}:`, error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Error rendering client template: ${error.message}`);
    }
  }

  /**
   * Renderiza una única sección del cliente como página independiente
   */
  async renderClientSection(clientId: string, sectionId: string, customData?: any): Promise<string> {
    try {
      const config = await this.loadClientConfiguration(clientId);
      const uploadedImages: UploadedImage[] = await this.imageStorageService.getClientImages(clientId);

      // Layout por estilo
      const layoutTemplate = await this.loadLayoutTemplateForStyle(config.style);

      // Buscar sección solicitada. Si no existe, error.
      const section = config.sections.find(s => s.id === sectionId);
      if (!section) {
        throw new NotFoundException(`Section not found: ${sectionId}`);
      }

      // Procesar SOLO las secciones habilitadas para tener todos los datos disponibles
      const enabledSections = config.sections
        .filter(section => section.enabled)
        .sort((a, b) => a.order - b.order);
      
      const processedAllSections = await Promise.all(
        enabledSections.map(async (section) => ({
          ...section,
          data: await this.processImagesInData(section.data, clientId, uploadedImages)
        }))
      );

      // Procesar datos
      const processedCompany = await this.processImagesInData(config.company, clientId, uploadedImages);
      const processedSectionData = await this.processImagesInData(section.data, clientId, uploadedImages);
      const processedCustomData = customData
        ? await this.processImagesInData(customData, clientId, uploadedImages)
        : undefined;

      // Construir "sections" con solo la sección solicitada habilitada
      const singleSection = [{ id: sectionId, enabled: true, order: section.order, data: processedSectionData }];

      const mergedData = {
        company: processedCompany,
        style: config.style,
        theme: config.theme,
        sections: singleSection, // Solo la sección específica para renderizado
        allSections: processedAllSections, // TODAS las secciones con sus datos completos
        footer: this.generateFooterData(config),
        navigation: this.generateNavigationData([section]),
        currentYear: new Date().getFullYear(),
        clientId,
        isMultiPage: true,
        currentSectionId: sectionId,
        ...processedCustomData
      };

      await this.registerPartials();
      const template = Handlebars.compile(layoutTemplate);
      return template(mergedData);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Error rendering client section: ${error.message}`);
    }
  }
  
  /**
   * Crea una nueva configuración de cliente
   */
  async createClientConfiguration(
    clientId: string,
    selectedSections: string[],
    style: 'clasico' | 'moderno' | 'minimalista' | 'colorido',
    companyData: any,
    customData?: any
  ): Promise<ClientConfiguration> {
    // Validar que las secciones requeridas estén incluidas
    const requiredSections = AVAILABLE_SECTIONS.filter(section => section.required);
    const missingRequired = requiredSections.filter(section => !selectedSections.includes(section.id));
    
    if (missingRequired.length > 0) {
      throw new BadRequestException(`Missing required sections: ${missingRequired.map(s => s.name).join(', ')}`);
    }
    
    // Crear configuración de secciones - SOLO las seleccionadas
    const sections: SectionConfiguration[] = selectedSections.map((sectionId, index) => {
      const sectionInfo = AVAILABLE_SECTIONS.find(s => s.id === sectionId);
      return {
        id: sectionId,
        enabled: true, // Todas las secciones seleccionadas están habilitadas
        order: sectionInfo?.order || index + 1,
        data: customData?.[sectionId] || this.getDefaultSectionData(sectionId)
      };
    });
    
    const config: ClientConfiguration = {
      clientId,
      name: companyData.name,
      description: companyData.description,
      style,
      sections,
      company: {
        name: companyData.name,
        tagline: companyData.tagline,
        description: companyData.description,
        logo: companyData.logo,
        favicon: companyData.favicon
      },
      theme: this.getThemeByStyle(style),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await this.saveClientConfiguration(clientId, config);
    return config;
  }
  
  /**
   * Actualiza la configuración de un cliente
   */
  async updateClientConfiguration(
    clientId: string,
    updates: Partial<ClientConfiguration>
  ): Promise<void> {
    const config = await this.loadClientConfiguration(clientId);
    const updatedConfig = { 
      ...config, 
      ...updates, 
      updatedAt: new Date() 
    };
    await this.saveClientConfiguration(clientId, updatedConfig);
  }
  
  /**
   * Obtiene la configuración de un cliente
   */
  async getClientConfiguration(clientId: string): Promise<ClientConfiguration> {
    return this.loadClientConfiguration(clientId);
  }
  
  /**
   * Lista todas las configuraciones de clientes
   */
  async listClientConfigurations(): Promise<ClientConfiguration[]> {
    const configsPath = join(process.cwd(), 'src', 'views', 'configurations');
    const files = await FileUtils.readDirectory(configsPath);
    
    const configs: ClientConfiguration[] = [];
    for (const file of files) {
      if (file.endsWith('.json')) {
        const clientId = file.replace('.json', '');
        try {
          const config = await this.loadClientConfiguration(clientId);
          configs.push(config);
        } catch (error) {
          // Skip invalid configs
          console.warn(`Invalid configuration for client ${clientId}:`, error.message);
        }
      }
    }
    
    return configs;
  }
  
  /**
   * Elimina la configuración de un cliente
   */
  async deleteClientConfiguration(clientId: string): Promise<void> {
    const configPath = join(process.cwd(), 'src', 'views', 'configurations', `${clientId}.json`);
    await FileUtils.deleteFile(configPath);
  }
  
  /**
   * Carga la configuración de un cliente desde archivo
   */
  private async loadClientConfiguration(clientId: string): Promise<ClientConfiguration> {
    const configPath = join(process.cwd(), 'src', 'views', 'configurations', `${clientId}.json`);
    
    if (!(await FileUtils.fileExists(configPath))) {
      throw new NotFoundException(`Configuration not found for client: ${clientId}`);
    }
    
    const configData = await FileUtils.readJsonFile(configPath);
    return {
      ...configData,
      createdAt: new Date(configData.createdAt),
      updatedAt: new Date(configData.updatedAt)
    };
  }
  
  /**
   * Guarda la configuración de un cliente en archivo
   */
  private async saveClientConfiguration(clientId: string, config: ClientConfiguration): Promise<void> {
    const configsPath = join(process.cwd(), 'src', 'views', 'configurations');
    const configPath = join(configsPath, `${clientId}.json`);
    
    await FileUtils.ensureDirectoryExists(configsPath);
    await FileUtils.writeJsonFile(configPath, config);
  }
  
  /**
   * Carga el layout template
   */
  private async loadLayoutTemplate(layoutName: string): Promise<string> {
    const layoutPath = join(process.cwd(), 'src', 'views', 'layouts', `${layoutName}.hbs`);
    
    if (!(await FileUtils.fileExists(layoutPath))) {
      throw new NotFoundException(`Layout template not found: ${layoutName}`);
    }
    
    return FileUtils.readTemplateFile(layoutPath);
  }

  /**
   * Carga el layout adecuado según el estilo del cliente, con fallback a 'dynamic'
   */
  private async loadLayoutTemplateForStyle(style: string): Promise<string> {
    const styleToLayoutMap: Record<string, string> = {
      clasico: 'clasico',
      moderno: 'moderno',
      minimalista: 'minimalista',
      colorido: 'colorido',
    };

    const preferred = styleToLayoutMap[style] || 'dynamic';

    // Intentar layout específico
    const preferredPath = join(process.cwd(), 'src', 'views', 'layouts', `${preferred}.hbs`);
    if (await FileUtils.fileExists(preferredPath)) {
      return FileUtils.readTemplateFile(preferredPath);
    }

    // Fallback por estilo 'dynamic'
    return this.loadLayoutTemplate('dynamic');
  }
  
  /**
   * Registra todos los partials necesarios
   */
  private async registerPartials(): Promise<void> {
    const partialsPath = join(process.cwd(), 'src', 'views', 'partials');
    
    console.log(`📁 Registering partials from: ${partialsPath}`);
    
    // Registrar helpers
    Handlebars.registerHelper('eq', function(a, b) {
      return a === b;
    });
    
    Handlebars.registerHelper('subtract', function(a, b) {
      return a - b;
    });
    
    Handlebars.registerHelper('json', function(obj) {
      return JSON.stringify(obj);
    });
    
    Handlebars.registerHelper('times', function(n, options) {
      let accum = '';
      for (let i = 0; i < n; ++i) {
        accum += options.fn(i);
      }
      return accum;
    });

    // Helper para formatear precios
    Handlebars.registerHelper('formatPrice', function(price: number) {
      if (typeof price !== 'number') return '0.00';
      return new Handlebars.SafeString(`$${price.toFixed(2)}`);
    });

    // Helper para generar enlaces seguros
    Handlebars.registerHelper('safeUrl', function(url: string) {
      if (!url || typeof url !== 'string') return '';
      try {
        new URL(url);
        return new Handlebars.SafeString(url);
      } catch {
        return '';
      }
    });

    // Helper para iterar con índice
    Handlebars.registerHelper('eachWithIndex', function(array, options) {
      let result = '';
      if (Array.isArray(array)) {
        for (let i = 0; i < array.length; i++) {
          result += options.fn({ ...array[i], index: i });
        }
      }
      return result;
    });

    // Helper condicional para comparaciones
    Handlebars.registerHelper('ifEquals', function(arg1, arg2, options) {
      return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
    });

    // Helper para truncar texto
    Handlebars.registerHelper('truncate', function(str: string, length: number) {
      if (!str || typeof str !== 'string') return '';
      if (str.length <= length) return str;
      return str.substring(0, length) + '...';
    });

    // Helper para repetir elementos (times)
    Handlebars.registerHelper('times', function(n: number, options) {
      let result = '';
      for (let i = 0; i < n; i++) {
        result += options.fn(this);
      }
      return result;
    });

    // Helper para comparaciones de igualdad (eq)
    Handlebars.registerHelper('eq', function(arg1, arg2, options) {
      return (arg1 === arg2) ? options.fn(this) : options.inverse(this);
    });
    
    console.log(`🔧 Handlebars helpers registered`);
    
    // Registrar componentes
    await this.registerPartialCategory('components', partialsPath);
    
    // Registrar secciones
    await this.registerPartialCategory('sections', partialsPath);
    
    // Registrar estilos
    await this.registerPartialCategory('styles', partialsPath);
    
    // Registrar scripts
    await this.registerPartialCategory('scripts', partialsPath);
    
    console.log(`✅ All partials registered successfully`);
  }

  /**
   * Renderiza un índice multipágina con enlaces a cada sección como página
   */
  async renderClientMultipageIndex(clientId: string): Promise<string> {
    const config = await this.loadClientConfiguration(clientId);
    const uploadedImages: UploadedImage[] = await this.imageStorageService.getClientImages(clientId);
    const layoutTemplate = await this.loadLayoutTemplateForStyle(config.style);

    // Procesar SOLO las secciones habilitadas para tener todos los datos disponibles
    const enabledSections = config.sections
      .filter(section => section.enabled)
      .sort((a, b) => a.order - b.order);
    
    const processedAllSections = await Promise.all(
      enabledSections.map(async (section) => ({
        ...section,
        data: await this.processImagesInData(section.data, clientId, uploadedImages)
      }))
    );

    const processedCompany = await this.processImagesInData(config.company, clientId, uploadedImages);

    // Construir una "sección" índice simple con links
    const indexSection = {
      id: 'index',
      enabled: true,
      order: 0,
      data: {
        title: 'Secciones',
        links: enabledSections.map(s => ({ id: s.id, href: `/api/v1/client-templates/${clientId}/section/${s.id}` }))
      }
    } as any;

    const mergedData = {
      company: processedCompany,
      style: config.style,
      theme: config.theme,
      sections: [indexSection], // Solo la sección índice para renderizado
      allSections: processedAllSections, // TODAS las secciones con sus datos completos
      footer: this.generateFooterData(config),
      navigation: this.generateNavigationData(enabledSections),
      currentYear: new Date().getFullYear(),
      clientId,
      isMultiPage: true,
      currentSectionId: 'index'
    };

    await this.registerPartials();
    const template = Handlebars.compile(layoutTemplate);
    return template(mergedData);
  }
  
  /**
   * Registra partials de una categoría específica
   */
  private async registerPartialCategory(category: string, basePath: string): Promise<void> {
    const categoryPath = join(basePath, category);
    
    if (!(await FileUtils.fileExists(categoryPath))) {
      console.log(`⚠️ Category path does not exist: ${categoryPath}`);
      return;
    }
    
    const files = await FileUtils.readDirectory(categoryPath);
    console.log(`📂 Found ${files.length} files in category ${category}:`, files);
    
    for (const file of files) {
      if (file.endsWith('.hbs')) {
        const partialName = file.replace('.hbs', '');
        const partialPath = join(categoryPath, file);
        
        try {
          const partialContent = await FileUtils.readTemplateFile(partialPath);
        Handlebars.registerPartial(`${category}/${partialName}`, partialContent);
          console.log(`✅ Registered partial: ${category}/${partialName}`);
        } catch (error) {
          console.error(`❌ Error registering partial ${category}/${partialName}:`, error.message);
        }
      }
    }
  }
  
  /**
   * Obtiene el tema según el estilo
   */
  private getThemeByStyle(style: string): any {
    const themes = {
      clasico: {
        colors: {
          primary: "340 82% 52%",
          primaryForeground: "0 0% 100%",
          secondary: "120 61% 34%",
          secondaryForeground: "0 0% 100%",
          background: "0 0% 100%",
          foreground: "222.2 84% 4.9%",
          accent: "340 82% 52%",
          accentForeground: "0 0% 100%"
        },
        fonts: {
          heading: "'Dancing Script', cursive",
          body: "'Poppins', sans-serif"
        }
      },
      moderno: {
        colors: {
          primary: "220 14% 96%",
          primaryForeground: "220 9% 46%",
          secondary: "220 14% 96%",
          secondaryForeground: "220 9% 46%",
          background: "0 0% 100%",
          foreground: "220 9% 46%",
          accent: "220 14% 96%",
          accentForeground: "220 9% 46%"
        },
        fonts: {
          heading: "'Inter', sans-serif",
          body: "'Inter', sans-serif"
        }
      },
      minimalista: {
        colors: {
          primary: "220 9% 46%",
          primaryForeground: "0 0% 100%",
          secondary: "220 9% 46%",
          secondaryForeground: "0 0% 100%",
          background: "0 0% 100%",
          foreground: "220 9% 46%",
          accent: "220 9% 46%",
          accentForeground: "0 0% 100%"
        },
        fonts: {
          heading: "'Inter', sans-serif",
          body: "'Inter', sans-serif"
        }
      }
    };
    
    return themes[style] || themes.clasico;
  }
  
  /**
   * Genera datos del footer
   */
  private generateFooterData(config: ClientConfiguration): any {
    return {
      tagline: config.company.description,
      social: [
        { name: "📘", href: "#" },
        { name: "📷", href: "#" },
        { name: "🐦", href: "#" }
      ],
      products: ["Ramos", "Arreglos", "Plantas", "Orquídeas"],
      contact: {
        phone: "+52 (55) 5678-9012",
        email: `info@${config.company.name.toLowerCase().replace(/\s+/g, '')}.com`,
        address: "Calle de las Flores 456, Centro Histórico"
      },
      copyright: `© ${new Date().getFullYear()} ${config.company.name}. Todos los derechos reservados.`
    };
  }
  
  /**
   * Genera datos de navegación
   */
  private generateNavigationData(sections: SectionConfiguration[]): any {
    return {
      menu: sections.map(section => ({
        text: this.getSectionDisplayName(section.id),
        href: `#${section.id}`
      })),
      cta: {
        text: "Contactar",
        href: "#contact"
      }
    };
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
   * Obtiene datos por defecto para una sección
   */
  private getDefaultSectionData(sectionId: string): any {
    const defaultData = {
      hero: {
        title: "Bienvenidos",
        subtitle: "Descubre nuestra colección única",
        backgroundImage: "/images/hero-bg.jpg",
        ctaButtons: [
          { text: "Ver Más", href: "#products", style: "primary" },
          { text: "Contactar", href: "#contact", style: "outline" }
        ]
      },
      about: {
        title: "Sobre Nosotros",
        content: ["Somos una empresa comprometida con la excelencia y la satisfacción del cliente."],
        image: "/images/about.jpg",
        imageAlt: "Sobre nosotros"
      },
      products: {
        title: "Nuestros Productos",
        subtitle: "Descubre nuestra colección",
        featuredProducts: [],
        categories: []
      },
      services: {
        title: "Nuestros Servicios",
        subtitle: "Ofrecemos soluciones profesionales",
        services: [
          {
            icon: "🛠️",
            title: "Servicio Profesional",
            description: "Servicios de alta calidad con años de experiencia",
            features: ["Calidad garantizada", "Atención personalizada", "Resultados comprobados"]
          }
        ]
      },
      testimonials: {
        title: "Lo que dicen nuestros clientes",
        subtitle: "Testimonios de clientes satisfechos",
        testimonials: [
          {
            name: "Cliente Satisfecho",
            position: "Cliente",
            quote: "Excelente servicio y atención al cliente",
            rating: [1, 1, 1, 1, 1],
            avatar: "/images/avatar1.jpg"
          }
        ]
      },
      gallery: {
        title: "Nuestra Galería",
        subtitle: "Mira nuestro trabajo",
        images: [
          {
            src: "/images/gallery1.jpg",
            alt: "Imagen de galería",
            title: "Trabajo 1",
            description: "Descripción del trabajo"
          }
        ],
        categories: [
          { name: "Todos" },
          { name: "Categoría 1" },
          { name: "Categoría 2" }
        ]
      },
      contact: {
        title: "Contáctanos",
        subtitle: "Estamos aquí para ayudarte",
        contactInfo: [
          {
            icon: "📞",
            title: "Teléfono",
            value: "+52 (55) 1234-5678"
          },
          {
            icon: "📧",
            title: "Email",
            value: "info@empresa.com"
          },
          {
            icon: "📍",
            title: "Dirección",
            value: "Calle Principal 123, Ciudad"
          }
        ],
        socialMedia: [
          { icon: "📘", url: "#" },
          { icon: "📷", url: "#" },
          { icon: "🐦", url: "#" }
        ]
      },
      cart: {
        title: "Carrito de Compras",
        subtitle: "Revisa tus productos seleccionados",
        items: [],
        subtotal: "0.00",
        shipping: "0.00",
        taxes: "0.00",
        total: "0.00"
      },
      appointments: {
        title: "Reserva tu Cita",
        subtitle: "Agenda una consulta personalizada",
        availableSlots: []
      },
      stats: {
        title: "Nuestros Números",
        subtitle: "Estadísticas que hablan por sí solas",
        statistics: [
          { value: "500+", label: "Clientes Satisfechos" },
          { value: "50+", label: "Proyectos Completados" },
          { value: "5+", label: "Años de Experiencia" },
          { value: "100%", label: "Satisfacción Garantizada" }
        ],
        achievements: [
          {
            icon: "🏆",
            title: "Premio a la Excelencia",
            description: "Reconocimiento por calidad de servicio"
          }
        ]
      }
    };
    
    return defaultData[sectionId] || {};
  }
}
