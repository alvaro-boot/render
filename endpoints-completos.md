# 📚 DOCUMENTACIÓN COMPLETA DE ENDPOINTS

## 🚀 BASE URL
```
http://localhost:3002/api/v1
```

---

## 📋 CLIENT TEMPLATES (Plantillas de Cliente)

### 1. **Crear Nueva Configuración de Cliente**
```http
POST /client-templates
```

**Body:**
```json
{
  "clientId": "mi-cliente-001",
  "name": "Mi Empresa",
  "description": "Descripción de mi empresa",
  "style": "colorido",
  "sections": [
    {
      "id": "hero",
      "enabled": true,
      "order": 1,
      "data": {
        "title": "Mi Empresa",
        "subtitle": "Descripción de mi empresa",
        "backgroundImage": "/images/hero-bg.jpg",
        "ctaButtons": [
          {
            "text": "Ver Productos",
            "href": "#products",
            "style": "primary"
          }
        ]
      }
    }
  ],
  "company": {
    "name": "Mi Empresa",
    "tagline": "Mi eslogan",
    "description": "Descripción de mi empresa",
    "logo": "/images/logo.png",
    "favicon": "/favicon.ico"
  },
  "theme": {
    "colors": {
      "primary": "45 100% 51%",
      "primaryForeground": "0 0% 100%",
      "secondary": "142 76% 36%",
      "secondaryForeground": "0 0% 100%",
      "background": "0 0% 100%",
      "foreground": "222.2 84% 4.9%",
      "accent": "330 100% 50%",
      "accentForeground": "0 0% 100%"
    },
    "fonts": {
      "heading": "'Fredoka One', cursive",
      "body": "'Nunito', sans-serif"
    }
  }
}
```

**Respuesta:**
```json
{
  "message": "Client configuration created successfully",
  "config": { /* configuración completa */ }
}
```

---

### 2. **Renderizar Página del Cliente**
```http
GET /client-templates/{clientId}
```

**Ejemplo:**
```bash
curl -X GET "http://localhost:3002/api/v1/client-templates/mi-cliente-001"
```

**Respuesta:** HTML de la página completa

---

### 3. **Renderizar con Datos Personalizados (sin guardar)**
```http
POST /client-templates/{clientId}/render
```

**Body:**
```json
{
  "hero": {
    "title": "Título Personalizado",
    "subtitle": "Subtítulo modificado"
  },
  "products": {
    "title": "Productos Especiales",
    "featuredProducts": [
      {
        "name": "Producto Especial",
        "price": 19.99
      }
    ]
  }
}
```

**Respuesta:** HTML con datos personalizados

---

### 4. **Obtener Configuración del Cliente**
```http
GET /client-templates/{clientId}/configuration
```

**Respuesta:**
```json
{
  "clientId": "mi-cliente-001",
  "name": "Mi Empresa",
  "style": "colorido",
  "sections": [ /* secciones */ ],
  "company": { /* datos de empresa */ },
  "theme": { /* tema */ },
  "createdAt": "2024-01-15T10:00:00.000Z",
  "updatedAt": "2024-01-15T10:00:00.000Z"
}
```

---

### 5. **Actualizar Configuración del Cliente**
```http
PUT /client-templates/{clientId}/configuration
```

**Body:**
```json
{
  "name": "Nuevo Nombre",
  "style": "moderno",
  "sections": [ /* secciones actualizadas */ ]
}
```

**Respuesta:**
```json
{
  "message": "Client configuration updated successfully"
}
```

---

### 6. **Listar Todas las Configuraciones**
```http
GET /client-templates
```

**Query Parameters:**
- `includeDisabled` (boolean): Incluir configuraciones deshabilitadas

**Ejemplo:**
```bash
curl -X GET "http://localhost:3002/api/v1/client-templates?includeDisabled=true"
```

---

### 7. **Eliminar Configuración del Cliente**
```http
DELETE /client-templates/{clientId}
```

**Respuesta:**
```json
{
  "message": "Client configuration deleted successfully"
}
```

---

### 8. **Obtener Secciones Disponibles**
```http
GET /client-templates/available-sections
```

**Respuesta:**
```json
{
  "sections": [
    {
      "id": "hero",
      "name": "Sección Hero",
      "description": "Sección principal con imagen de fondo",
      "required": true,
      "order": 1,
      "template": "hero",
      "category": "content",
      "icon": "🏠",
      "dataSchema": {
        "title": "string",
        "subtitle": "string",
        "backgroundImage": "string",
        "ctaButtons": "array"
      }
    }
  ],
  "categories": {
    "content": "Contenido",
    "commerce": "Comercio",
    "social": "Social",
    "contact": "Contacto"
  }
}
```

---

### 9. **Previsualizar Plantilla con Datos de Ejemplo**
```http
GET /client-templates/{clientId}/preview
```

**Respuesta:** HTML con datos de ejemplo para previsualización

---

## 🎨 TEMPLATES BÁSICOS

### 1. **Renderizar Template Estático**
```http
GET /template/{project}
```

**Ejemplo:**
```bash
curl -X GET "http://localhost:3002/api/v1/template/client-001"
```

---

### 2. **Renderizar Template Completo**
```http
GET /template/{project}/render
```

---

### 3. **Renderizar Template con Preview**
```http
POST /template/{project}/render
```

**Body:**
```json
{
  "data": {
    "hero": {
      "title": "Mi Página Personalizada"
    }
  }
}
```

---

### 4. **Guardar Datos Personalizados**
```http
PUT /template/{project}/custom-data
```

**Body:**
```json
{
  "hero": {
    "title": "Título Guardado",
    "subtitle": "Subtítulo Guardado"
  }
}
```

---

### 5. **Obtener Datos Estáticos**
```http
GET /template/{project}/static-data
```

---

### 6. **Obtener Datos Personalizados**
```http
GET /template/{project}/custom-data
```

---

## 📁 STORAGE (Almacenamiento)

### 1. **Subir Imagen**
```http
POST /storage/images/upload
```

**Body:** FormData con archivo de imagen

**Respuesta:**
```json
{
  "filename": "imagen.jpg",
  "url": "/api/v1/storage/images/imagen.jpg",
  "size": 1024,
  "mimetype": "image/jpeg"
}
```

---

### 2. **Obtener Imagen**
```http
GET /storage/images/{filename}
```

---

### 3. **Listar Imágenes**
```http
GET /storage/images
```

---

### 4. **Eliminar Imagen**
```http
DELETE /storage/images/{filename}
```

---

## 🎯 ESTILOS DISPONIBLES

### 1. **Clásico**
- **Archivo:** `src/views/partials/styles/clasico.hbs`
- **Scripts:** `src/views/partials/scripts/clasico.hbs`
- **Características:** Elegante, romántico, con efectos de pétalos

### 2. **Moderno**
- **Archivo:** `src/views/partials/styles/moderno.hbs`
- **Scripts:** `src/views/partials/scripts/moderno.hbs`
- **Características:** Limpio, profesional, minimalista

### 3. **Minimalista**
- **Archivo:** `src/views/partials/styles/minimalista.hbs`
- **Scripts:** `src/views/partials/scripts/minimalista.hbs`
- **Características:** Ultra minimalista, sin efectos

### 4. **Colorido** ✨
- **Archivo:** `src/views/partials/styles/colorido.hbs`
- **Scripts:** `src/views/partials/scripts/colorido.hbs`
- **Características:** Vibrante, animaciones, efectos de confeti

---

## 📋 SECCIONES DISPONIBLES

| ID | Nombre | Categoría | Requerida | Descripción |
|----|--------|-----------|-----------|-------------|
| `hero` | Sección Hero | content | ✅ | Sección principal con imagen de fondo |
| `about` | Sobre Nosotros | content | ❌ | Información sobre la empresa |
| `products` | Productos | commerce | ❌ | Catálogo de productos |
| `services` | Servicios | commerce | ❌ | Lista de servicios |
| `testimonials` | Testimonios | social | ❌ | Opiniones de clientes |
| `gallery` | Galería | content | ❌ | Galería de imágenes |
| `contact` | Contacto | contact | ❌ | Información de contacto |
| `cart` | Carrito | commerce | ❌ | Carrito de compras |
| `appointments` | Citas | commerce | ❌ | Sistema de citas |
| `stats` | Estadísticas | content | ❌ | Métricas del negocio |

---

## 🎨 ESTRUCTURA DE DATOS

### **Sección Hero**
```json
{
  "title": "string",
  "subtitle": "string",
  "backgroundImage": "string",
  "ctaButtons": [
    {
      "text": "string",
      "href": "string",
      "style": "primary|outline"
    }
  ]
}
```

### **Sección Products**
```json
{
  "title": "string",
  "subtitle": "string",
  "featuredProducts": [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "price": "number",
      "image": "string",
      "imageAlt": "string",
      "category": "string",
      "features": ["string"]
    }
  ],
  "categories": ["string"]
}
```

### **Sección Services**
```json
{
  "title": "string",
  "subtitle": "string",
  "services": [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "icon": "string",
      "price": "string"
    }
  ]
}
```

---

## 🔧 EJEMPLOS DE USO

### **Crear Cliente con Estilo Colorido**
```bash
curl -X POST "http://localhost:3002/api/v1/client-templates" \
  -H "Content-Type: application/json" \
  -d @client-colorido.json
```

### **Renderizar Página**
```bash
curl -X GET "http://localhost:3002/api/v1/client-templates/mi-cliente-001"
```

### **Actualizar Configuración**
```bash
curl -X PUT "http://localhost:3002/api/v1/client-templates/mi-cliente-001/configuration" \
  -H "Content-Type: application/json" \
  -d '{
    "style": "moderno",
    "sections": [
      {
        "id": "hero",
        "enabled": true,
        "order": 1,
        "data": {
          "title": "Nuevo Título"
        }
      }
    ]
  }'
```

---

## 📝 NOTAS IMPORTANTES

1. **Sección Hero es obligatoria** - Siempre debe estar habilitada
2. **Estilos válidos** - Solo `'clasico'`, `'moderno'`, `'minimalista'`, `'colorido'`
3. **Colores en formato HSL** - Ejemplo: `"45 100% 51%"`
4. **Fuentes de Google** - Las fuentes deben estar disponibles en Google Fonts
5. **Imágenes** - Las rutas deben ser relativas o URLs completas
6. **Orden de secciones** - Importante para el renderizado final

---

## 🚨 CÓDIGOS DE ERROR

| Código | Descripción |
|--------|-------------|
| `400` | Bad Request - Datos inválidos |
| `404` | Not Found - Cliente no encontrado |
| `500` | Internal Server Error - Error del servidor |

---

## 📚 ARCHIVOS DE CONFIGURACIÓN

### **Ubicaciones:**
- **Configuraciones:** `src/views/configurations/`
- **Estilos:** `src/views/partials/styles/`
- **Scripts:** `src/views/partials/scripts/`
- **Secciones:** `src/views/partials/sections/`
- **Componentes:** `src/views/partials/components/`
- **Layouts:** `src/views/layouts/`

### **Ejemplos de Configuración:**
- `client-001.json` - Floristería (estilo clásico)
- `client-002.json` - Servicios Profesionales (estilo moderno)
- `client-003.json` - Fiesta Colorida (estilo colorido)
