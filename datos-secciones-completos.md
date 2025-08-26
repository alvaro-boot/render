# Datos Requeridos para Cada Sección

## Información General

Cuando creas una configuración de cliente, cada sección en el array `sections` debe incluir un campo `data` con la información específica que necesita esa sección. A continuación se detalla exactamente qué datos incluir para cada sección disponible.

## Estructura Base de una Sección

```json
{
  "id": "nombre-seccion",
  "enabled": true,
  "order": 1,
  "data": {
    // Datos específicos de la sección (ver detalles abajo)
  }
}
```

---

## 1. Sección HERO (Obligatoria)

**ID:** `hero`  
**Descripción:** Sección principal con imagen de fondo y llamada a la acción

### Datos Requeridos:

```json
{
  "id": "hero",
  "enabled": true,
  "order": 1,
  "data": {
    "title": "Título Principal",
    "subtitle": "Subtítulo o descripción breve",
    "backgroundImage": "/ruta/a/imagen-fondo.jpg",
    "ctaButtons": [
      {
        "text": "Texto del botón",
        "href": "#seccion-destino",
        "style": "primary" // o "outline"
      },
      {
        "text": "Segundo botón",
        "href": "#otra-seccion",
        "style": "outline"
      }
    ]
  }
}
```

### Ejemplo Completo:
```json
{
  "id": "hero",
  "enabled": true,
  "order": 1,
  "data": {
    "title": "Mi Empresa",
    "subtitle": "Soluciones innovadoras para tu negocio",
    "backgroundImage": "/images/hero-bg.jpg",
    "ctaButtons": [
      {
        "text": "Ver Servicios",
        "href": "#services",
        "style": "primary"
      },
      {
        "text": "Contactar",
        "href": "#contact",
        "style": "outline"
      }
    ]
  }
}
```

---

## 2. Sección ABOUT (Opcional)

**ID:** `about`  
**Descripción:** Información sobre la empresa o negocio

### Datos Requeridos:

```json
{
  "id": "about",
  "enabled": true,
  "order": 2,
  "data": {
    "title": "Sobre Nosotros",
    "content": [
      "Primer párrafo de contenido",
      "Segundo párrafo de contenido",
      "Tercer párrafo de contenido"
    ],
    "image": "/ruta/a/imagen.jpg",
    "imageAlt": "Descripción de la imagen"
  }
}
```

### Ejemplo Completo:
```json
{
  "id": "about",
  "enabled": true,
  "order": 2,
  "data": {
    "title": "Sobre Nosotros",
    "content": [
      "Somos una empresa con más de 10 años de experiencia en el sector.",
      "Nuestro equipo está comprometido con la excelencia y la satisfacción del cliente.",
      "Ofrecemos soluciones personalizadas que se adaptan a tus necesidades."
    ],
    "image": "/images/about-us.jpg",
    "imageAlt": "Nuestro equipo trabajando"
  }
}
```

---

## 3. Sección PRODUCTS (Opcional)

**ID:** `products`  
**Descripción:** Catálogo de productos o servicios

### Datos Requeridos:

```json
{
  "id": "products",
  "enabled": true,
  "order": 3,
  "data": {
    "title": "Nuestros Productos",
    "subtitle": "Descripción de la sección de productos",
    "featuredProducts": [
      {
        "id": "producto-1",
        "name": "Nombre del Producto",
        "description": "Descripción detallada del producto",
        "price": 99.99,
        "image": "/ruta/a/imagen-producto.jpg",
        "imageAlt": "Descripción de la imagen",
        "category": "Categoría del producto",
        "features": [
          "Característica 1",
          "Característica 2",
          "Característica 3"
        ]
      }
    ],
    "categories": [
      "Categoría 1",
      "Categoría 2",
      "Categoría 3"
    ]
  }
}
```

### Ejemplo Completo:
```json
{
  "id": "products",
  "enabled": true,
  "order": 3,
  "data": {
    "title": "Nuestro Catálogo",
    "subtitle": "Descubre nuestra colección de productos únicos",
    "featuredProducts": [
      {
        "id": "producto-premium",
        "name": "Producto Premium",
        "description": "Descripción detallada del producto premium con todas sus características.",
        "price": 199.99,
        "image": "/images/producto-premium.jpg",
        "imageAlt": "Producto Premium",
        "category": "Premium",
        "features": [
          "Calidad superior",
          "Garantía de 2 años",
          "Envío gratuito",
          "Soporte 24/7"
        ]
      }
    ],
    "categories": [
      "Básico",
      "Premium",
      "Profesional"
    ]
  }
}
```

---

## 4. Sección SERVICES (Opcional)

**ID:** `services`  
**Descripción:** Lista de servicios ofrecidos

### Datos Requeridos:

```json
{
  "id": "services",
  "enabled": true,
  "order": 4,
  "data": {
    "title": "Nuestros Servicios",
    "subtitle": "Descripción de la sección de servicios",
    "services": [
      {
        "id": "servicio-1",
        "name": "Nombre del Servicio",
        "description": "Descripción detallada del servicio",
        "icon": "🔧",
        "price": "Desde $100.00"
      }
    ]
  }
}
```

### Ejemplo Completo:
```json
{
  "id": "services",
  "enabled": true,
  "order": 4,
  "data": {
    "title": "Nuestros Servicios",
    "subtitle": "Ofrecemos servicios especializados para tu negocio",
    "services": [
      {
        "id": "consultoria",
        "name": "Consultoría Empresarial",
        "description": "Análisis estratégico y planificación para optimizar tu negocio.",
        "icon": "📊",
        "price": "Desde $500.00"
      },
      {
        "id": "marketing",
        "name": "Marketing Digital",
        "description": "Estrategias de marketing online para aumentar tu presencia digital.",
        "icon": "📱",
        "price": "Desde $300.00"
      }
    ]
  }
}
```

---

## 5. Sección TESTIMONIALS (Opcional)

**ID:** `testimonials`  
**Descripción:** Opiniones y comentarios de clientes

### Datos Requeridos:

```json
{
  "id": "testimonials",
  "enabled": true,
  "order": 5,
  "data": {
    "title": "Lo que dicen nuestros clientes",
    "subtitle": "Descripción de la sección de testimonios",
    "reviews": [
      {
        "id": "review-1",
        "name": "Nombre del Cliente",
        "role": "Cargo o empresa",
        "content": "Comentario del cliente sobre el servicio",
        "rating": 5,
        "image": "/ruta/a/foto-cliente.jpg"
      }
    ]
  }
}
```

### Ejemplo Completo:
```json
{
  "id": "testimonials",
  "enabled": true,
  "order": 5,
  "data": {
    "title": "Lo que dicen nuestros clientes",
    "subtitle": "Testimonios de clientes satisfechos",
    "reviews": [
      {
        "id": "review-1",
        "name": "María García",
        "role": "CEO, TechCorp",
        "content": "Excelente servicio y resultados superiores a nuestras expectativas.",
        "rating": 5,
        "image": "/images/cliente-1.jpg"
      },
      {
        "id": "review-2",
        "name": "Carlos López",
        "role": "Director, InnovateLab",
        "content": "Profesionalismo y calidad en cada proyecto que realizamos juntos.",
        "rating": 5,
        "image": "/images/cliente-2.jpg"
      }
    ]
  }
}
```

---

## 6. Sección GALLERY (Opcional)

**ID:** `gallery`  
**Descripción:** Galería de imágenes

### Datos Requeridos:

```json
{
  "id": "gallery",
  "enabled": true,
  "order": 6,
  "data": {
    "title": "Nuestra Galería",
    "subtitle": "Descripción de la galería",
    "images": [
      {
        "id": "imagen-1",
        "src": "/ruta/a/imagen-1.jpg",
        "alt": "Descripción de la imagen",
        "title": "Título de la imagen",
        "category": "Categoría"
      }
    ]
  }
}
```

### Ejemplo Completo:
```json
{
  "id": "gallery",
  "enabled": true,
  "order": 6,
  "data": {
    "title": "Nuestra Galería",
    "subtitle": "Mira algunos de nuestros trabajos más destacados",
    "images": [
      {
        "id": "proyecto-1",
        "src": "/images/proyecto-1.jpg",
        "alt": "Proyecto de diseño web",
        "title": "Diseño Web Corporativo",
        "category": "Diseño Web"
      },
      {
        "id": "proyecto-2",
        "src": "/images/proyecto-2.jpg",
        "alt": "Aplicación móvil",
        "title": "App Móvil E-commerce",
        "category": "Desarrollo Móvil"
      }
    ]
  }
}
```

---

## 7. Sección CONTACT (Opcional)

**ID:** `contact`  
**Descripción:** Información de contacto y formulario

### Datos Requeridos:

```json
{
  "id": "contact",
  "enabled": true,
  "order": 7,
  "data": {
    "title": "Contáctanos",
    "subtitle": "Descripción de la sección de contacto",
    "info": {
      "address": "Dirección completa",
      "phone": "+1 234 567 890",
      "email": "contacto@empresa.com",
      "hours": "Lun-Vie: 9:00 AM - 6:00 PM"
    },
    "map": {
      "latitude": 40.7128,
      "longitude": -74.0060,
      "zoom": 15
    }
  }
}
```

### Ejemplo Completo:
```json
{
  "id": "contact",
  "enabled": true,
  "order": 7,
  "data": {
    "title": "Contáctanos",
    "subtitle": "Estamos aquí para ayudarte",
    "info": {
      "address": "Calle Principal 123, Ciudad, País",
      "phone": "+1 234 567 890",
      "email": "contacto@miempresa.com",
      "hours": "Lun-Vie: 9:00 AM - 6:00 PM, Sáb: 10:00 AM - 2:00 PM"
    },
    "map": {
      "latitude": 40.7128,
      "longitude": -74.0060,
      "zoom": 15
    }
  }
}
```

---

## 8. Sección CART (Opcional)

**ID:** `cart`  
**Descripción:** Funcionalidad de carrito de compras

### Datos Requeridos:

```json
{
  "id": "cart",
  "enabled": true,
  "order": 8,
  "data": {
    "title": "Carrito de Compras",
    "subtitle": "Revisa tus productos seleccionados",
    "items": [],
    "subtotal": "0.00",
    "shipping": "5.00",
    "taxes": "0.00",
    "total": "5.00"
  }
}
```

### Ejemplo Completo:
```json
{
  "id": "cart",
  "enabled": true,
  "order": 8,
  "data": {
    "title": "Carrito de Compras",
    "subtitle": "Revisa tus productos seleccionados",
    "items": [],
    "subtotal": "0.00",
    "shipping": "5.00",
    "taxes": "0.00",
    "total": "5.00"
  }
}
```

---

## 9. Sección APPOINTMENTS (Opcional)

**ID:** `appointments`  
**Descripción:** Sistema de reservas y citas

### Datos Requeridos:

```json
{
  "id": "appointments",
  "enabled": true,
  "order": 9,
  "data": {
    "title": "Agenda tu Cita",
    "subtitle": "Descripción de la sección de citas",
    "availableSlots": [
      "09:00 AM",
      "10:00 AM",
      "11:00 AM",
      "02:00 PM",
      "03:00 PM",
      "04:00 PM"
    ]
  }
}
```

### Ejemplo Completo:
```json
{
  "id": "appointments",
  "enabled": true,
  "order": 9,
  "data": {
    "title": "Agenda tu Cita",
    "subtitle": "Reserva una cita personalizada para discutir tus necesidades",
    "availableSlots": [
      "09:00 AM",
      "10:00 AM",
      "11:00 AM",
      "02:00 PM",
      "03:00 PM",
      "04:00 PM"
    ]
  }
}
```

---

## 10. Sección STATS (Opcional)

**ID:** `stats`  
**Descripción:** Métricas y números importantes del negocio

### Datos Requeridos:

```json
{
  "id": "stats",
  "enabled": true,
  "order": 10,
  "data": {
    "title": "Nuestros Números",
    "subtitle": "Descripción de la sección de estadísticas",
    "metrics": [
      {
        "id": "metric-1",
        "number": "500+",
        "label": "Clientes Satisfechos",
        "icon": "👥"
      }
    ]
  }
}
```

### Ejemplo Completo:
```json
{
  "id": "stats",
  "enabled": true,
  "order": 10,
  "data": {
    "title": "Nuestros Números",
    "subtitle": "Métricas que hablan por sí solas",
    "metrics": [
      {
        "id": "clientes",
        "number": "500+",
        "label": "Clientes Satisfechos",
        "icon": "👥"
      },
      {
        "id": "proyectos",
        "number": "1000+",
        "label": "Proyectos Completados",
        "icon": "✅"
      },
      {
        "id": "experiencia",
        "number": "10+",
        "label": "Años de Experiencia",
        "icon": "📈"
      },
      {
        "id": "equipo",
        "number": "25+",
        "label": "Profesionales",
        "icon": "👨‍💼"
      }
    ]
  }
}
```

---

## Notas Importantes

1. **Sección HERO es obligatoria** - Siempre debe estar incluida y habilitada
2. **Orden de las secciones** - El campo `order` determina el orden de aparición en la página
3. **Secciones deshabilitadas** - Si `enabled: false`, el campo `data` puede estar vacío `{}`
4. **Imágenes** - Las rutas de imágenes deben ser relativas al directorio público
5. **Iconos** - Puedes usar emojis o clases CSS para los iconos
6. **Precios** - Pueden ser números (99.99) o strings ("Desde $100.00")

## Ejemplo de Configuración Completa

```json
{
  "clientId": "mi-cliente",
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
        "subtitle": "Soluciones innovadoras",
        "backgroundImage": "/images/hero.jpg",
        "ctaButtons": [
          {
            "text": "Ver Servicios",
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
        "subtitle": "Servicios especializados",
        "services": [
          {
            "id": "servicio-1",
            "name": "Consultoría",
            "description": "Servicio de consultoría",
            "icon": "📊",
            "price": "Desde $100"
          }
        ]
      }
    }
  ],
  "company": {
    "name": "Mi Empresa",
    "tagline": "Tagline de la empresa",
    "description": "Descripción completa",
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
