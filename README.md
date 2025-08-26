# Template Renderer Service - Sistema Modular

Un microservicio NestJS profesional para gestión y renderizado de plantillas HTML modulares con Handlebars. Permite crear sitios web personalizados donde los clientes pueden elegir qué secciones incluir en su sitio web.

## 🚀 Características

- **Sistema Modular**: Los clientes pueden elegir qué secciones incluir en su sitio web
- **Plantillas Dinámicas**: Secciones independientes que se pueden habilitar/deshabilitar
- **Múltiples Estilos**: Clásico, Moderno y Minimalista
- **Motor de plantillas**: Handlebars (.hbs) con helpers personalizados
- **Gestión de datos**: Separación entre datos estáticos y personalizados
- **Renderizado dinámico**: Múltiples modos de renderizado
- **API RESTful**: Endpoints bien definidos para todas las operaciones
- **Arquitectura modular**: Código organizado siguiendo mejores prácticas de NestJS

## 📁 Estructura del Proyecto

```
src/
├── main.ts                    # Punto de entrada de la aplicación
├── app.module.ts             # Módulo principal
├── config/                   # Configuración
│   ├── configuration.ts      # Variables de entorno
│   ├── constants.ts          # Constantes del sistema
│   └── sections.config.ts    # Configuración de secciones disponibles
├── shared/                   # Módulos compartidos
│   ├── filters/             # Filtros de excepción
│   ├── utils/               # Utilidades
│   ├── interfaces/          # Interfaces base
│   └── shared.module.ts
├── template/                 # Módulo de plantillas
│   ├── controllers/         # Controladores REST
│   │   ├── template.controller.ts
│   │   └── client-template.controller.ts
│   ├── services/           # Lógica de negocio
│   │   ├── template.service.ts
│   │   └── template-configuration.service.ts
│   ├── dto/                # Data Transfer Objects
│   │   ├── create-client-configuration.dto.ts
│   │   └── update-client-configuration.dto.ts
│   ├── interfaces/         # Interfaces específicas
│   │   └── section.interface.ts
│   └── template.module.ts
├── storage/                  # Módulo de almacenamiento
│   ├── controllers/         # Controladores de archivos
│   ├── services/           # Servicios de archivos
│   └── storage.module.ts
└── views/                   # Plantillas HTML
    ├── layouts/             # Layouts principales
    │   └── dynamic.hbs      # Layout dinámico
    ├── partials/            # Componentes modulares
    │   ├── components/      # Componentes reutilizables
    │   │   ├── navbar.hbs
    │   │   └── footer.hbs
    │   ├── sections/        # Secciones de contenido
    │   │   ├── hero.hbs
    │   │   ├── about.hbs
    │   │   ├── products.hbs
    │   │   ├── services.hbs
    │   │   ├── cart.hbs
    │   │   ├── appointments.hbs
    │   │   └── ...
    │   ├── styles/          # Estilos por tema
    │   │   ├── clasico.hbs
    │   │   ├── moderno.hbs
    │   │   └── minimalista.hbs
    │   └── scripts/         # Scripts por tema
    │       ├── clasico.hbs
    │       ├── moderno.hbs
    │       └── minimalista.hbs
    └── configurations/      # Configuraciones de clientes
        ├── client-001.json
        ├── client-002.json
        └── ...
```

## 🎯 Secciones Disponibles

### Contenido
- **Hero**: Sección principal con imagen de fondo y llamada a la acción
- **About**: Información sobre la empresa o negocio
- **Gallery**: Galería de imágenes
- **Stats**: Métricas y números importantes del negocio

### Comercio
- **Products**: Catálogo de productos o servicios
- **Services**: Lista de servicios ofrecidos
- **Cart**: Funcionalidad de carrito de compras
- **Appointments**: Sistema de reservas y citas

### Social
- **Testimonials**: Opiniones y comentarios de clientes

### Contacto
- **Contact**: Información de contacto y formulario

## 🛠 Instalación y Configuración

### Prerrequisitos
- Node.js 18+ 
- npm o yarn

### Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd template-renderer-service
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno** (opcional)
```bash
# .env
PORT=3000
NODE_ENV=development
TEMPLATES_PATH=src/views
MAX_FILE_SIZE=5242880
```

4. **Ejecutar en modo desarrollo**
```bash
npm run start:dev
```

5. **Ejecutar en producción**
```bash
npm run build
npm run start:prod
```

## 📚 API Endpoints

### Plantillas de Clientes

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/v1/client-templates/:clientId` | Renderiza la plantilla de un cliente |
| `POST` | `/api/v1/client-templates/:clientId/render` | Renderiza con datos personalizados |
| `GET` | `/api/v1/client-templates/:clientId/preview` | Previsualiza con datos de ejemplo |
| `GET` | `/api/v1/client-templates/:clientId/configuration` | Obtiene configuración del cliente |

### Gestión de Configuraciones

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/api/v1/client-templates` | Crea nueva configuración de cliente |
| `PUT` | `/api/v1/client-templates/:clientId/configuration` | Actualiza configuración |
| `GET` | `/api/v1/client-templates` | Lista todas las configuraciones |
| `DELETE` | `/api/v1/client-templates/:clientId` | Elimina configuración |

### Información del Sistema

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/v1/client-templates/available-sections` | Secciones disponibles |

### Plantillas Legacy (Compatibilidad)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/v1/template/:project` | Renderiza plantilla legacy |
| `GET` | `/api/v1/template/:project/render` | Renderiza con datos personalizados |
| `POST` | `/api/v1/template/:project/render` | Previsualización |

## 🎨 Ejemplos de Uso

### Crear una Nueva Configuración de Cliente

```bash
curl -X POST http://localhost:3000/api/v1/client-templates \
  -H "Content-Type: application/json" \
  -d '{
    "clientId": "floristeria-maria",
    "name": "Floristería María",
    "description": "Floristería artesanal",
    "style": "clasico",
    "sections": [
      {
        "id": "hero",
        "enabled": true,
        "order": 1,
        "data": {
          "title": "Floristería María",
          "subtitle": "Donde cada flor cuenta una historia"
        }
      },
      {
        "id": "products",
        "enabled": true,
        "order": 2,
        "data": {
          "title": "Nuestros Productos"
        }
      },
      {
        "id": "cart",
        "enabled": true,
        "order": 3,
        "data": {
          "title": "Carrito de Compras"
        }
      }
    ],
    "company": {
      "name": "Floristería María",
      "tagline": "Donde cada flor cuenta una historia",
      "description": "Floristería artesanal con más de 20 años de experiencia"
    },
    "theme": {
      "colors": {
        "primary": "340 82% 52%",
        "primaryForeground": "0 0% 100%",
        "secondary": "120 61% 34%",
        "secondaryForeground": "0 0% 100%"
      },
      "fonts": {
        "heading": "'Dancing Script', cursive",
        "body": "'Poppins', sans-serif"
      }
    }
  }'
```

### Renderizar Plantilla de Cliente

```bash
# Renderizar plantilla básica
curl http://localhost:3000/api/v1/client-templates/floristeria-maria

# Renderizar con datos personalizados
curl -X POST http://localhost:3000/api/v1/client-templates/floristeria-maria/render \
  -H "Content-Type: application/json" \
  -d '{
    "hero": {
      "title": "Título Personalizado",
      "subtitle": "Subtítulo personalizado"
    }
  }'
```

### Obtener Secciones Disponibles

```bash
curl http://localhost:3000/api/v1/client-templates/available-sections
```

## 🎯 Casos de Uso

### Cliente 1: Floristería con Productos y Carrito
- **Secciones**: Hero, Products, Cart
- **Estilo**: Clásico
- **Resultado**: Sitio web de e-commerce para venta de flores

### Cliente 2: Consultoría con Servicios y Citas
- **Secciones**: Hero, Services, Appointments, About
- **Estilo**: Moderno
- **Resultado**: Sitio web profesional para servicios de consultoría

### Cliente 3: Solo Información de Contacto
- **Secciones**: Hero, About, Contact
- **Estilo**: Minimalista
- **Resultado**: Sitio web simple con información básica

## 📊 Acceso a Todos los Datos de Secciones

### Nueva Funcionalidad

Cada página renderizada ahora incluye **todas las secciones seleccionadas por el usuario** y **todos sus datos**, tanto habilitadas como deshabilitadas. Esto permite:

- **Renderizado completo**: Todas las secciones seleccionadas se renderizan en la página
- **Acceso completo a datos**: Todas las secciones configuradas están disponibles
- **Flexibilidad**: Puedes usar datos de secciones deshabilitadas en otras partes
- **Consistencia**: Los datos están siempre disponibles independientemente del estado de la sección

### Cómo Funciona el Renderizado

#### Secciones que se Renderizan

- **Todas las secciones seleccionadas por el usuario** se renderizan en la página
- **Orden de renderizado**: Según el campo `order` de cada sección
- **Navegación**: Incluye enlaces a todas las secciones seleccionadas
- **Datos disponibles**: Todos los datos de todas las secciones están disponibles en JavaScript

#### Control de Visibilidad

- El campo `enabled` ahora controla principalmente la **navegación y enlaces**
- **Todas las secciones seleccionadas se renderizan** independientemente del estado `enabled`
- Puedes usar CSS o JavaScript para ocultar secciones específicas si es necesario

### Ejemplos de Uso

#### Ejemplo 1: Usar datos de sección deshabilitada en otra sección

```javascript
// En una sección de productos, mostrar información de contacto
const contactData = window.getSectionData('contact');
if (contactData) {
  document.getElementById('contact-info').innerHTML = `
    <p>📞 ${contactData.contactInfo[0].value}</p>
    <p>📧 ${contactData.contactInfo[1].value}</p>
  `;
}
```

#### Ejemplo 2: Crear un menú dinámico con todas las secciones

```javascript
const allSections = window.allSections || [];
const menu = document.getElementById('dynamic-menu');

allSections.forEach(section => {
  const menuItem = document.createElement('li');
  menuItem.innerHTML = `
    <a href="#${section.id}" class="${section.enabled ? 'enabled' : 'disabled'}">
      ${section.name || section.id}
    </a>
  `;
  menu.appendChild(menuItem);
});
```

#### Ejemplo 3: Validar datos antes de mostrar una sección

```javascript
const productsData = window.getSectionData('products');
if (productsData && productsData.featuredProducts && productsData.featuredProducts.length > 0) {
  // Mostrar sección de productos
  document.getElementById('products-section').style.display = 'block';
} else {
  // Ocultar sección si no hay productos
  document.getElementById('products-section').style.display = 'none';
}
```

## 🔧 Desarrollo

### Agregar Nueva Sección

1. **Definir la sección en `sections.config.ts`**:
```typescript
{
  id: 'nueva-seccion',
  name: 'Nueva Sección',
  description: 'Descripción de la nueva sección',
  required: false,
  order: 11,
  template: 'nueva-seccion',
  category: 'content',
  icon: '🆕',
  dataSchema: {
    title: 'string',
    content: 'array'
  }
}
```

2. **Crear el partial en `src/views/partials/sections/nueva-seccion.hbs`**:
```handlebars
<section id="nueva-seccion" class="py-24 bg-white">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <h2 class="text-5xl font-bold text-gray-900 mb-6">{{data.title}}</h2>
    {{#each data.content}}
    <p class="text-lg text-gray-700 mb-4">{{this}}</p>
    {{/each}}
  </div>
</section>
```

3. **Agregar datos por defecto en el servicio**:
```typescript
private getDefaultSectionData(sectionId: string): any {
  const defaultData = {
    // ... otras secciones
    nuevaSeccion: {
      title: "Nueva Sección",
      content: ["Contenido por defecto"]
    }
  };
  
  return defaultData[sectionId] || {};
}
```

### Agregar Nuevo Estilo

1. **Crear estilos en `src/views/partials/styles/nuevo-estilo.hbs`**
2. **Crear scripts en `src/views/partials/scripts/nuevo-estilo.hbs`**
3. **Agregar el tema en `TemplateConfigurationService.getThemeByStyle()`**

## 🚀 Próximas Características

- [ ] Editor visual para configuraciones
- [ ] Sistema de plantillas predefinidas
- [ ] Integración con CMS
- [ ] Sistema de versionado de configuraciones
- [ ] Exportación a Next.js/React
- [ ] Sistema de caché para mejor performance
- [ ] Analytics y métricas de uso

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.