# Control de Visibilidad de Secciones

## 📋 Resumen

Ahora que todas las secciones seleccionadas por el usuario se renderizan, puedes usar CSS y JavaScript para controlar su visibilidad según tus necesidades.

## 🎨 Control con CSS

### Ocultar Secciones Deshabilitadas

```css
/* Ocultar secciones que no están habilitadas */
.section-disabled {
  display: none !important;
}

/* O alternativamente, usar atributos de datos */
[data-enabled="false"] {
  display: none !important;
}
```

### Ocultar Secciones Específicas

```css
/* Ocultar sección de carrito si no hay productos */
#cart-section:empty {
  display: none;
}

/* Ocultar sección de testimonios si no hay datos */
#testimonials-section:has(.testimonial:empty) {
  display: none;
}
```

### Mostrar/Ocultar Condicionalmente

```css
/* Mostrar sección solo en pantallas grandes */
@media (max-width: 768px) {
  .desktop-only-section {
    display: none;
  }
}

/* Ocultar sección en modo móvil */
@media (max-width: 480px) {
  .mobile-hidden {
    display: none;
  }
}
```

## 🔧 Control con JavaScript

### Función para Ocultar Secciones Deshabilitadas

```javascript
function hideDisabledSections() {
  const allSections = window.allSections || [];
  
  allSections.forEach(section => {
    if (!section.enabled) {
      const sectionElement = document.getElementById(section.id);
      if (sectionElement) {
        sectionElement.classList.add('section-disabled');
        sectionElement.style.display = 'none';
      }
    }
  });
}

// Ejecutar al cargar la página
document.addEventListener('DOMContentLoaded', hideDisabledSections);
```

### Función para Mostrar/Ocultar Según Contenido

```javascript
function toggleSectionsByContent() {
  // Ocultar carrito si no hay productos
  const productsData = window.getSectionData('products');
  const cartSection = document.getElementById('cart-section');
  
  if (cartSection) {
    if (!productsData || !productsData.featuredProducts || productsData.featuredProducts.length === 0) {
      cartSection.style.display = 'none';
    } else {
      cartSection.style.display = 'block';
    }
  }
  
  // Ocultar testimonios si no hay datos
  const testimonialsData = window.getSectionData('testimonials');
  const testimonialsSection = document.getElementById('testimonials-section');
  
  if (testimonialsSection) {
    if (!testimonialsData || !testimonialsData.testimonials || testimonialsData.testimonials.length === 0) {
      testimonialsSection.style.display = 'none';
    } else {
      testimonialsSection.style.display = 'block';
    }
  }
  
  // Ocultar galería si no hay imágenes
  const galleryData = window.getSectionData('gallery');
  const gallerySection = document.getElementById('gallery-section');
  
  if (gallerySection) {
    if (!galleryData || !galleryData.images || galleryData.images.length === 0) {
      gallerySection.style.display = 'none';
    } else {
      gallerySection.style.display = 'block';
    }
  }
}
```

### Función para Control Dinámico

```javascript
function createVisibilityControls() {
  const allSections = window.allSections || [];
  const controlsContainer = document.getElementById('visibility-controls');
  
  if (!controlsContainer) return;
  
  const controlsHTML = `
    <div class="visibility-controls">
      <h3>Control de Visibilidad</h3>
      ${allSections.map(section => `
        <label class="control-item">
          <input type="checkbox" 
                 id="toggle-${section.id}" 
                 ${section.enabled ? 'checked' : ''}
                 onchange="toggleSection('${section.id}', this.checked)">
          <span>${section.id}</span>
        </label>
      `).join('')}
    </div>
  `;
  
  controlsContainer.innerHTML = controlsHTML;
}

function toggleSection(sectionId, visible) {
  const sectionElement = document.getElementById(sectionId);
  if (sectionElement) {
    sectionElement.style.display = visible ? 'block' : 'none';
  }
}
```

### Función para Validación de Contenido

```javascript
function validateAndShowSections() {
  const allSections = window.allSections || [];
  
  allSections.forEach(section => {
    const sectionElement = document.getElementById(section.id);
    if (!sectionElement) return;
    
    let shouldShow = true;
    
    // Validar según el tipo de sección
    switch (section.id) {
      case 'products':
        shouldShow = section.data && section.data.featuredProducts && section.data.featuredProducts.length > 0;
        break;
        
      case 'testimonials':
        shouldShow = section.data && section.data.testimonials && section.data.testimonials.length > 0;
        break;
        
      case 'gallery':
        shouldShow = section.data && section.data.images && section.data.images.length > 0;
        break;
        
      case 'services':
        shouldShow = section.data && section.data.services && section.data.services.length > 0;
        break;
        
      case 'stats':
        shouldShow = section.data && section.data.statistics && section.data.statistics.length > 0;
        break;
        
      default:
        shouldShow = section.enabled;
    }
    
    // Aplicar visibilidad
    sectionElement.style.display = shouldShow ? 'block' : 'none';
    
    // Agregar clase para estilos CSS
    if (shouldShow) {
      sectionElement.classList.remove('section-hidden');
      sectionElement.classList.add('section-visible');
    } else {
      sectionElement.classList.remove('section-visible');
      sectionElement.classList.add('section-hidden');
    }
  });
}
```

## 🎯 Ejemplos de Uso Práctico

### Ejemplo 1: Ocultar Secciones Vacías Automáticamente

```javascript
// Agregar al final del script en el layout
document.addEventListener('DOMContentLoaded', function() {
  // Ocultar secciones deshabilitadas
  hideDisabledSections();
  
  // Validar contenido y mostrar/ocultar
  validateAndShowSections();
  
  // Crear controles de visibilidad (opcional)
  createVisibilityControls();
});
```

### Ejemplo 2: Mostrar Indicadores de Estado

```javascript
function addSectionStatusIndicators() {
  const allSections = window.allSections || [];
  
  allSections.forEach(section => {
    const sectionElement = document.getElementById(section.id);
    if (!sectionElement) return;
    
    // Agregar indicador de estado
    const statusIndicator = document.createElement('div');
    statusIndicator.className = `status-indicator ${section.enabled ? 'enabled' : 'disabled'}`;
    statusIndicator.innerHTML = section.enabled ? '✅' : '❌';
    statusIndicator.title = section.enabled ? 'Sección habilitada' : 'Sección deshabilitada';
    
    sectionElement.insertBefore(statusIndicator, sectionElement.firstChild);
  });
}
```

### Ejemplo 3: Animaciones de Transición

```css
/* Estilos para transiciones suaves */
.section-visible {
  opacity: 1;
  transform: translateY(0);
  transition: all 0.3s ease-in-out;
}

.section-hidden {
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.3s ease-in-out;
}

/* Indicadores de estado */
.status-indicator {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}

.status-indicator.enabled {
  background-color: #10b981;
  color: white;
}

.status-indicator.disabled {
  background-color: #ef4444;
  color: white;
}
```

## 📝 Notas Importantes

1. **Renderizado Completo**: Todas las secciones seleccionadas se renderizan en el HTML
2. **Control de Visibilidad**: Usa CSS o JavaScript para mostrar/ocultar según necesidades
3. **Rendimiento**: Las secciones ocultas con CSS no afectan el rendimiento significativamente
4. **SEO**: Las secciones ocultas con CSS siguen siendo indexables por motores de búsqueda
5. **Accesibilidad**: Considera usar `visibility: hidden` en lugar de `display: none` para lectores de pantalla

## 🔗 Integración con el Sistema

Estas funciones se pueden integrar fácilmente en los layouts existentes agregando el script al final del body:

```html
<script>
// Funciones de control de visibilidad
// ... (código de las funciones anteriores)

// Ejecutar al cargar la página
document.addEventListener('DOMContentLoaded', function() {
  hideDisabledSections();
  validateAndShowSections();
  addSectionStatusIndicators();
});
</script>
```
