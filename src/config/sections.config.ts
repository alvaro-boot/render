import { Section } from '../template/interfaces/section.interface';

export const AVAILABLE_SECTIONS: Section[] = [
  {
    id: 'hero',
    name: 'Sección Hero',
    description: 'Sección principal con imagen de fondo y llamada a la acción',
    required: true,
    order: 1,
    template: 'hero',
    category: 'content',
    icon: '🏠',
    dataSchema: {
      title: 'string',
      subtitle: 'string',
      backgroundImage: 'string',
      ctaButtons: 'array'
    }
  },
  {
    id: 'about',
    name: 'Sobre Nosotros',
    description: 'Información sobre la empresa o negocio',
    required: false,
    order: 2,
    template: 'about',
    category: 'content',
    icon: 'ℹ️',
    dataSchema: {
      title: 'string',
      content: 'array',
      image: 'string',
      imageAlt: 'string'
    }
  },
  {
    id: 'products',
    name: 'Productos',
    description: 'Catálogo de productos o servicios',
    required: false,
    order: 3,
    template: 'products',
    category: 'commerce',
    icon: '🛍️',
    dataSchema: {
      title: 'string',
      subtitle: 'string',
      featuredProducts: 'array',
      categories: 'array'
    }
  },
  {
    id: 'services',
    name: 'Servicios',
    description: 'Lista de servicios ofrecidos',
    required: false,
    order: 4,
    template: 'services',
    category: 'commerce',
    icon: '🔧',
    dataSchema: {
      title: 'string',
      subtitle: 'string',
      services: 'array'
    }
  },
  {
    id: 'testimonials',
    name: 'Testimonios',
    description: 'Opiniones y comentarios de clientes',
    required: false,
    order: 5,
    template: 'testimonials',
    category: 'social',
    icon: '💬',
    dataSchema: {
      title: 'string',
      subtitle: 'string',
      reviews: 'array'
    }
  },
  {
    id: 'gallery',
    name: 'Galería',
    description: 'Galería de imágenes',
    required: false,
    order: 6,
    template: 'gallery',
    category: 'content',
    icon: '🖼️',
    dataSchema: {
      title: 'string',
      subtitle: 'string',
      images: 'array'
    }
  },
  {
    id: 'contact',
    name: 'Contacto',
    description: 'Información de contacto y formulario',
    required: false,
    order: 7,
    template: 'contact',
    category: 'contact',
    icon: '📞',
    dataSchema: {
      title: 'string',
      subtitle: 'string',
      info: 'object',
      map: 'object'
    }
  },
  {
    id: 'cart',
    name: 'Carrito de Compras',
    description: 'Funcionalidad de carrito de compras',
    required: false,
    order: 8,
    template: 'cart',
    category: 'commerce',
    icon: '🛒',
    dataSchema: {
      title: 'string',
      items: 'array'
    }
  },
  {
    id: 'appointments',
    name: 'Citas',
    description: 'Sistema de reservas y citas',
    required: false,
    order: 9,
    template: 'appointments',
    category: 'commerce',
    icon: '📅',
    dataSchema: {
      title: 'string',
      subtitle: 'string',
      availableSlots: 'array'
    }
  },
  {
    id: 'stats',
    name: 'Estadísticas',
    description: 'Métricas y números importantes del negocio',
    required: false,
    order: 10,
    template: 'stats',
    category: 'content',
    icon: '📊',
    dataSchema: {
      title: 'string',
      subtitle: 'string',
      metrics: 'array'
    }
  }
];

export const SECTION_CATEGORIES = {
  content: 'Contenido',
  commerce: 'Comercio',
  social: 'Social',
  contact: 'Contacto'
} as const;

export const getSectionsByCategory = (category: string): Section[] => {
  return AVAILABLE_SECTIONS.filter(section => section.category === category);
};

export const getRequiredSections = (): Section[] => {
  return AVAILABLE_SECTIONS.filter(section => section.required);
};

export const getOptionalSections = (): Section[] => {
  return AVAILABLE_SECTIONS.filter(section => !section.required);
};
