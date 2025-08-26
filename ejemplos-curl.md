# 🚀 EJEMPLOS DE CURLS PARA PROBAR

## 📋 CLIENT TEMPLATES

### 1. **Crear Cliente con Estilo Colorido**
```bash
curl -X POST "http://localhost:3002/api/v1/client-templates" \
  -H "Content-Type: application/json" \
  -d '{
    "clientId": "test-colorido",
    "name": "Fiesta Colorida",
    "description": "Eventos vibrantes y alegres",
    "style": "colorido",
    "sections": [
      {
        "id": "hero",
        "enabled": true,
        "order": 1,
        "data": {
          "title": "Fiesta Colorida",
          "subtitle": "Donde cada momento es una celebración",
          "backgroundImage": "/images/party-bg.jpg",
          "ctaButtons": [
            {
              "text": "Ver Eventos",
              "href": "#products",
              "style": "primary"
            }
          ]
        }
      },
      {
        "id": "products",
        "enabled": true,
        "order": 2,
        "data": {
          "title": "Nuestros Eventos",
          "subtitle": "Experiencias únicas",
          "featuredProducts": [
            {
              "name": "Fiesta de Cumpleaños",
              "description": "Celebración completa",
              "price": 299.99,
              "image": "/images/birthday.jpg",
              "category": "Eventos"
            }
          ]
        }
      },
      {
        "id": "about",
        "enabled": false,
        "order": 3,
        "data": {}
      },
      {
        "id": "services",
        "enabled": false,
        "order": 4,
        "data": {}
      },
      {
        "id": "testimonials",
        "enabled": false,
        "order": 5,
        "data": {}
      },
      {
        "id": "gallery",
        "enabled": false,
        "order": 6,
        "data": {}
      },
      {
        "id": "contact",
        "enabled": false,
        "order": 7,
        "data": {}
      },
      {
        "id": "cart",
        "enabled": false,
        "order": 8,
        "data": {}
      },
      {
        "id": "appointments",
        "enabled": false,
        "order": 9,
        "data": {}
      },
      {
        "id": "stats",
        "enabled": false,
        "order": 10,
        "data": {}
      }
    ],
    "company": {
      "name": "Fiesta Colorida",
      "tagline": "Donde cada momento es una celebración",
      "description": "Especialistas en eventos únicos",
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
  }'
```

### 2. **Crear Cliente con Estilo Moderno**
```bash
curl -X POST "http://localhost:3002/api/v1/client-templates" \
  -H "Content-Type: application/json" \
  -d '{
    "clientId": "test-moderno",
    "name": "Tech Solutions",
    "description": "Soluciones tecnológicas modernas",
    "style": "moderno",
    "sections": [
      {
        "id": "hero",
        "enabled": true,
        "order": 1,
        "data": {
          "title": "Tech Solutions",
          "subtitle": "El futuro es ahora",
          "backgroundImage": "/images/tech-bg.jpg",
          "ctaButtons": [
            {
              "text": "Explorar",
              "href": "#services",
              "style": "primary"
            }
          ]
        }
      },
      {
        "id": "services",
        "enabled": true,
        "order": 2,
        "data": {
          "title": "Nuestros Servicios",
          "subtitle": "Soluciones innovadoras",
          "services": [
            {
              "name": "Desarrollo Web",
              "description": "Sitios web modernos",
              "icon": "💻",
              "price": "Desde $500"
            }
          ]
        }
      },
      {
        "id": "about",
        "enabled": false,
        "order": 3,
        "data": {}
      },
      {
        "id": "products",
        "enabled": false,
        "order": 4,
        "data": {}
      },
      {
        "id": "testimonials",
        "enabled": false,
        "order": 5,
        "data": {}
      },
      {
        "id": "gallery",
        "enabled": false,
        "order": 6,
        "data": {}
      },
      {
        "id": "contact",
        "enabled": false,
        "order": 7,
        "data": {}
      },
      {
        "id": "cart",
        "enabled": false,
        "order": 8,
        "data": {}
      },
      {
        "id": "appointments",
        "enabled": false,
        "order": 9,
        "data": {}
      },
      {
        "id": "stats",
        "enabled": false,
        "order": 10,
        "data": {}
      }
    ],
    "company": {
      "name": "Tech Solutions",
      "tagline": "El futuro es ahora",
      "description": "Soluciones tecnológicas de vanguardia",
      "logo": "/images/logo.png",
      "favicon": "/favicon.ico"
    },
    "theme": {
      "colors": {
        "primary": "220 14% 96%",
        "primaryForeground": "220 9% 46%",
        "secondary": "220 14% 96%",
        "secondaryForeground": "220 9% 46%",
        "background": "0 0% 100%",
        "foreground": "220 9% 46%",
        "accent": "220 14% 96%",
        "accentForeground": "220 9% 46%"
      },
      "fonts": {
        "heading": "'Inter', sans-serif",
        "body": "'Inter', sans-serif"
      }
    }
  }'
```

### 3. **Renderizar Página del Cliente**
```bash
curl -X GET "http://localhost:3002/api/v1/client-templates/test-colorido"
```

### 4. **Renderizar con Datos Personalizados**
```bash
curl -X POST "http://localhost:3002/api/v1/client-templates/test-colorido/render" \
  -H "Content-Type: application/json" \
  -d '{
    "hero": {
      "title": "Título Personalizado",
      "subtitle": "Subtítulo modificado"
    },
    "products": {
      "title": "Productos Especiales",
      "featuredProducts": [
        {
          "name": "Producto Especial",
          "description": "Descripción personalizada",
          "price": 19.99
        }
      ]
    }
  }'
```

### 5. **Obtener Configuración del Cliente**
```bash
curl -X GET "http://localhost:3002/api/v1/client-templates/test-colorido/configuration"
```

### 6. **Actualizar Configuración**
```bash
curl -X PUT "http://localhost:3002/api/v1/client-templates/test-colorido/configuration" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Nuevo Nombre",
    "style": "moderno",
    "sections": [
      {
        "id": "hero",
        "enabled": true,
        "order": 1,
        "data": {
          "title": "Nuevo Título",
          "subtitle": "Nuevo subtítulo"
        }
      }
    ]
  }'
```

### 7. **Listar Todas las Configuraciones**
```bash
curl -X GET "http://localhost:3002/api/v1/client-templates"
```

### 8. **Obtener Secciones Disponibles**
```bash
curl -X GET "http://localhost:3002/api/v1/client-templates/available-sections"
```

### 9. **Previsualizar Plantilla**
```bash
curl -X GET "http://localhost:3002/api/v1/client-templates/test-colorido/preview"
```

### 10. **Eliminar Cliente**
```bash
curl -X DELETE "http://localhost:3002/api/v1/client-templates/test-colorido"
```

---

## 🎨 TEMPLATES BÁSICOS

### 1. **Renderizar Template Estático**
```bash
curl -X GET "http://localhost:3002/api/v1/template/client-001"
```

### 2. **Renderizar Template Completo**
```bash
curl -X GET "http://localhost:3002/api/v1/template/client-001/render"
```

### 3. **Renderizar con Preview**
```bash
curl -X POST "http://localhost:3002/api/v1/template/client-001/render" \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "hero": {
        "title": "Mi Página Personalizada",
        "subtitle": "Descripción personalizada"
      }
    }
  }'
```

### 4. **Guardar Datos Personalizados**
```bash
curl -X PUT "http://localhost:3002/api/v1/template/client-001/custom-data" \
  -H "Content-Type: application/json" \
  -d '{
    "hero": {
      "title": "Título Guardado",
      "subtitle": "Subtítulo Guardado"
    }
  }'
```

### 5. **Obtener Datos Estáticos**
```bash
curl -X GET "http://localhost:3002/api/v1/template/client-001/static-data"
```

### 6. **Obtener Datos Personalizados**
```bash
curl -X GET "http://localhost:3002/api/v1/template/client-001/custom-data"
```

---

## 📁 STORAGE

### 1. **Subir Imagen**
```bash
curl -X POST "http://localhost:3002/api/v1/storage/images/upload" \
  -F "file=@/path/to/image.jpg"
```

### 2. **Obtener Imagen**
```bash
curl -X GET "http://localhost:3002/api/v1/storage/images/imagen.jpg"
```

### 3. **Listar Imágenes**
```bash
curl -X GET "http://localhost:3002/api/v1/storage/images"
```

### 4. **Eliminar Imagen**
```bash
curl -X DELETE "http://localhost:3002/api/v1/storage/images/imagen.jpg"
```

---

## 🔧 EJEMPLOS RÁPIDOS

### **Crear Cliente Mínimo (Solo Hero)**
```bash
curl -X POST "http://localhost:3002/api/v1/client-templates" \
  -H "Content-Type: application/json" \
  -d '{
    "clientId": "test-minimal",
    "name": "Test Mínimo",
    "style": "clasico",
    "sections": [
      {
        "id": "hero",
        "enabled": true,
        "order": 1,
        "data": {
          "title": "Test",
          "subtitle": "Test"
        }
      },
      {
        "id": "about",
        "enabled": false,
        "order": 2,
        "data": {}
      },
      {
        "id": "products",
        "enabled": false,
        "order": 3,
        "data": {}
      },
      {
        "id": "services",
        "enabled": false,
        "order": 4,
        "data": {}
      },
      {
        "id": "testimonials",
        "enabled": false,
        "order": 5,
        "data": {}
      },
      {
        "id": "gallery",
        "enabled": false,
        "order": 6,
        "data": {}
      },
      {
        "id": "contact",
        "enabled": false,
        "order": 7,
        "data": {}
      },
      {
        "id": "cart",
        "enabled": false,
        "order": 8,
        "data": {}
      },
      {
        "id": "appointments",
        "enabled": false,
        "order": 9,
        "data": {}
      },
      {
        "id": "stats",
        "enabled": false,
        "order": 10,
        "data": {}
      }
    ],
    "company": {
      "name": "Test",
      "tagline": "Test",
      "description": "Test"
    },
    "theme": {
      "colors": {
        "primary": "0 0% 0%",
        "primaryForeground": "0 0% 100%",
        "secondary": "0 0% 96%",
        "secondaryForeground": "0 0% 9%",
        "background": "0 0% 100%",
        "foreground": "0 0% 9%",
        "accent": "0 0% 0%",
        "accentForeground": "0 0% 100%"
      },
      "fonts": {
        "heading": "Arial, sans-serif",
        "body": "Arial, sans-serif"
      }
    }
  }'
```

### **Probar Todos los Estilos**
```bash
# Clásico
curl -X POST "http://localhost:3002/api/v1/client-templates" -H "Content-Type: application/json" -d '{"clientId":"test-clasico","name":"Test Clásico","style":"clasico","sections":[{"id":"hero","enabled":true,"order":1,"data":{"title":"Test","subtitle":"Test"}}],"company":{"name":"Test","tagline":"Test","description":"Test"},"theme":{"colors":{"primary":"0 0% 0%","primaryForeground":"0 0% 100%","secondary":"0 0% 96%","secondaryForeground":"0 0% 9%","background":"0 0% 100%","foreground":"0 0% 9%","accent":"0 0% 0%","accentForeground":"0 0% 100%"},"fonts":{"heading":"Arial","body":"Arial"}}}'

# Moderno
curl -X POST "http://localhost:3002/api/v1/client-templates" -H "Content-Type: application/json" -d '{"clientId":"test-moderno","name":"Test Moderno","style":"moderno","sections":[{"id":"hero","enabled":true,"order":1,"data":{"title":"Test","subtitle":"Test"}}],"company":{"name":"Test","tagline":"Test","description":"Test"},"theme":{"colors":{"primary":"0 0% 0%","primaryForeground":"0 0% 100%","secondary":"0 0% 96%","secondaryForeground":"0 0% 9%","background":"0 0% 100%","foreground":"0 0% 9%","accent":"0 0% 0%","accentForeground":"0 0% 100%"},"fonts":{"heading":"Arial","body":"Arial"}}}'

# Minimalista
curl -X POST "http://localhost:3002/api/v1/client-templates" -H "Content-Type: application/json" -d '{"clientId":"test-minimalista","name":"Test Minimalista","style":"minimalista","sections":[{"id":"hero","enabled":true,"order":1,"data":{"title":"Test","subtitle":"Test"}}],"company":{"name":"Test","tagline":"Test","description":"Test"},"theme":{"colors":{"primary":"0 0% 0%","primaryForeground":"0 0% 100%","secondary":"0 0% 96%","secondaryForeground":"0 0% 9%","background":"0 0% 100%","foreground":"0 0% 9%","accent":"0 0% 0%","accentForeground":"0 0% 100%"},"fonts":{"heading":"Arial","body":"Arial"}}}'

# Colorido
curl -X POST "http://localhost:3002/api/v1/client-templates" -H "Content-Type: application/json" -d '{"clientId":"test-colorido","name":"Test Colorido","style":"colorido","sections":[{"id":"hero","enabled":true,"order":1,"data":{"title":"Test","subtitle":"Test"}}],"company":{"name":"Test","tagline":"Test","description":"Test"},"theme":{"colors":{"primary":"0 0% 0%","primaryForeground":"0 0% 100%","secondary":"0 0% 96%","secondaryForeground":"0 0% 9%","background":"0 0% 100%","foreground":"0 0% 9%","accent":"0 0% 0%","accentForeground":"0 0% 100%"},"fonts":{"heading":"Arial","body":"Arial"}}}'
```

---

## 📝 NOTAS

1. **Reemplaza `localhost:3002`** con tu URL del servidor si es diferente
2. **Ajusta las rutas de imágenes** según tu configuración
3. **Modifica los datos** según tus necesidades
4. **Guarda los cURLs** en archivos `.sh` para reutilizarlos
5. **Usa Postman o Insomnia** para pruebas más visuales
