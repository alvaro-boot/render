export const TEMPLATE_CONSTANTS = {
  STATIC_DATA_FILE: 'static-data.json',
  CUSTOM_DATA_FILE: 'custom-data.json',
  TEMPLATE_FILE: 'index.hbs',
  VIEWS_PATH: 'src/views',
  MAX_TEMPLATE_NAME_LENGTH: 50,
  ALLOWED_TEMPLATE_NAME_PATTERN: /^[a-zA-Z0-9_-]+$/,
} as const;

export const HTTP_MESSAGES = {
  TEMPLATE_NOT_FOUND: 'Template not found',
  INVALID_TEMPLATE_NAME: 'Invalid template name',
  FILE_NOT_FOUND: 'File not found',
  INVALID_JSON_DATA: 'Invalid JSON data provided',
  TEMPLATE_RENDER_ERROR: 'Error rendering template',
} as const;

// Categorías válidas (slugs sin espacios para URL)
export const TEMPLATE_CATEGORIES = ['productos', 'servicios', 'productos-servicios'] as const;
export type TemplateCategory = typeof TEMPLATE_CATEGORIES[number];

// Etiquetas legibles para UI/logs (opcional)
export const TEMPLATE_CATEGORY_LABELS: Record<TemplateCategory, string> = {
  'productos': 'Productos',
  'servicios': 'Servicios',
  'productos-servicios': 'Productos y servicios',
} as const; 