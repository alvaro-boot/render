# Ejemplos de Uso: Acceso a Todos los Datos de Secciones

## 📋 Resumen

Cada página renderizada ahora incluye **todos los datos de las secciones del usuario**, tanto habilitadas como deshabilitadas. Esto proporciona máxima flexibilidad para el desarrollo frontend.

## 🔧 Configuración

### Variables Globales Disponibles

```javascript
// Datos completos de todas las secciones
window.allSections = [
  {
    id: "hero",
    enabled: true,
    order: 1,
    data: { /* datos de la sección */ }
  },
  {
    id: "about", 
    enabled: false,
    order: 2,
    data: { /* datos de la sección */ }
  }
  // ... más secciones
];

// ID del cliente actual
window.clientId = "mi-cliente";

// Datos de la empresa
window.company = {
  name: "Mi Empresa",
  tagline: "Mi eslogan",
  // ... más datos
};
```

### Funciones Helper Disponibles

```javascript
// Obtener datos de una sección específica
const heroData = window.getSectionData('hero');

// Obtener todas las secciones habilitadas
const enabledSections = window.getEnabledSections();

// Obtener todas las secciones deshabilitadas
const disabledSections = window.getDisabledSections();
```

## 🎯 Ejemplos Prácticos

### Ejemplo 1: Menú Dinámico con Todas las Secciones

```javascript
function createDynamicMenu() {
  const menuContainer = document.getElementById('dynamic-menu');
  const allSections = window.allSections || [];
  
  const menuHTML = allSections.map(section => `
    <li class="menu-item ${section.enabled ? 'enabled' : 'disabled'}">
      <a href="#${section.id}" class="menu-link">
        <span class="section-name">${section.id}</span>
        ${section.enabled ? '✅' : '❌'}
      </a>
    </li>
  `).join('');
  
  menuContainer.innerHTML = menuHTML;
}

// Usar
document.addEventListener('DOMContentLoaded', createDynamicMenu);
```

### Ejemplo 2: Mostrar Información de Contacto en Múltiples Secciones

```javascript
function displayContactInfo() {
  const contactData = window.getSectionData('contact');
  
  if (contactData && contactData.contactInfo) {
    // Mostrar en footer
    const footerContact = document.getElementById('footer-contact');
    if (footerContact) {
      footerContact.innerHTML = `
        <div class="contact-info">
          <p>📞 ${contactData.contactInfo[0]?.value || 'No disponible'}</p>
          <p>📧 ${contactData.contactInfo[1]?.value || 'No disponible'}</p>
          <p>📍 ${contactData.contactInfo[2]?.value || 'No disponible'}</p>
        </div>
      `;
    }
    
    // Mostrar en navbar
    const navbarContact = document.getElementById('navbar-contact');
    if (navbarContact) {
      navbarContact.innerHTML = `
        <span class="phone">${contactData.contactInfo[0]?.value || ''}</span>
      `;
    }
  }
}
```

### Ejemplo 3: Validación Condicional de Contenido

```javascript
function validateAndDisplayContent() {
  // Verificar si hay productos antes de mostrar sección de carrito
  const productsData = window.getSectionData('products');
  const cartSection = document.getElementById('cart-section');
  
  if (productsData && productsData.featuredProducts && productsData.featuredProducts.length > 0) {
    cartSection.style.display = 'block';
    
    // Mostrar contador de productos
    const productCount = productsData.featuredProducts.length;
    document.getElementById('product-count').textContent = productCount;
  } else {
    cartSection.style.display = 'none';
  }
  
  // Verificar si hay testimonios
  const testimonialsData = window.getSectionData('testimonials');
  const testimonialsSection = document.getElementById('testimonials-section');
  
  if (testimonialsData && testimonialsData.testimonials && testimonialsData.testimonials.length > 0) {
    testimonialsSection.style.display = 'block';
  } else {
    testimonialsSection.style.display = 'none';
  }
}
```

### Ejemplo 4: Crear Dashboard de Administración

```javascript
function createAdminDashboard() {
  const allSections = window.allSections || [];
  const dashboard = document.getElementById('admin-dashboard');
  
  const dashboardHTML = `
    <div class="dashboard">
      <h2>Dashboard de ${window.company.name}</h2>
      
      <div class="stats">
        <div class="stat-card">
          <h3>Total de Secciones</h3>
          <p class="stat-number">${allSections.length}</p>
        </div>
        <div class="stat-card">
          <h3>Secciones Activas</h3>
          <p class="stat-number">${allSections.filter(s => s.enabled).length}</p>
        </div>
        <div class="stat-card">
          <h3>Secciones Inactivas</h3>
          <p class="stat-number">${allSections.filter(s => !s.enabled).length}</p>
        </div>
      </div>
      
      <div class="sections-list">
        <h3>Estado de Secciones</h3>
        ${allSections.map(section => `
          <div class="section-item ${section.enabled ? 'enabled' : 'disabled'}">
            <span class="section-name">${section.id}</span>
            <span class="section-status">${section.enabled ? '✅ Activa' : '❌ Inactiva'}</span>
            <span class="section-order">Orden: ${section.order}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  
  dashboard.innerHTML = dashboardHTML;
}
```

### Ejemplo 5: Búsqueda en Todas las Secciones

```javascript
function searchInAllSections(searchTerm) {
  const allSections = window.allSections || [];
  const results = [];
  
  allSections.forEach(section => {
    if (section.data) {
      // Buscar en título
      if (section.data.title && section.data.title.toLowerCase().includes(searchTerm.toLowerCase())) {
        results.push({
          section: section.id,
          field: 'title',
          value: section.data.title,
          enabled: section.enabled
        });
      }
      
      // Buscar en contenido
      if (section.data.content) {
        const content = Array.isArray(section.data.content) 
          ? section.data.content.join(' ') 
          : section.data.content;
        
        if (content.toLowerCase().includes(searchTerm.toLowerCase())) {
          results.push({
            section: section.id,
            field: 'content',
            value: content.substring(0, 100) + '...',
            enabled: section.enabled
          });
        }
      }
      
      // Buscar en productos
      if (section.data.featuredProducts) {
        section.data.featuredProducts.forEach(product => {
          if (product.name && product.name.toLowerCase().includes(searchTerm.toLowerCase())) {
            results.push({
              section: section.id,
              field: 'product',
              value: product.name,
              enabled: section.enabled
            });
          }
        });
      }
    }
  });
  
  return results;
}

// Usar la búsqueda
const searchResults = searchInAllSections('producto');
console.log('Resultados de búsqueda:', searchResults);
```

### Ejemplo 6: Exportar Datos Completos

```javascript
function exportAllData() {
  const exportData = {
    clientId: window.clientId,
    company: window.company,
    allSections: window.allSections,
    exportDate: new Date().toISOString(),
    summary: {
      totalSections: window.allSections.length,
      enabledSections: window.getEnabledSections().length,
      disabledSections: window.getDisabledSections().length
    }
  };
  
  // Crear archivo de descarga
  const dataStr = JSON.stringify(exportData, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `${window.clientId}-data-${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  
  URL.revokeObjectURL(url);
}
```

### Ejemplo 7: Comparar Configuraciones

```javascript
function compareSections() {
  const allSections = window.allSections || [];
  
  // Encontrar secciones con datos similares
  const sectionsWithData = allSections.filter(section => 
    section.data && Object.keys(section.data).length > 0
  );
  
  console.log('Secciones con datos:', sectionsWithData.map(s => s.id));
  
  // Encontrar secciones vacías
  const emptySections = allSections.filter(section => 
    !section.data || Object.keys(section.data).length === 0
  );
  
  console.log('Secciones vacías:', emptySections.map(s => s.id));
  
  // Mostrar estadísticas
  const stats = {
    total: allSections.length,
    withData: sectionsWithData.length,
    empty: emptySections.length,
    enabled: allSections.filter(s => s.enabled).length,
    disabled: allSections.filter(s => !s.enabled).length
  };
  
  console.log('Estadísticas:', stats);
  return stats;
}
```

## 🚀 Casos de Uso Avanzados

### Integración con APIs Externas

```javascript
async function syncWithExternalAPI() {
  const allSections = window.allSections || [];
  
  // Sincronizar productos con sistema externo
  const productsData = window.getSectionData('products');
  if (productsData && productsData.featuredProducts) {
    try {
      const response = await fetch('/api/external/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: window.clientId,
          products: productsData.featuredProducts
        })
      });
      
      if (response.ok) {
        console.log('Productos sincronizados exitosamente');
      }
    } catch (error) {
      console.error('Error sincronizando productos:', error);
    }
  }
}
```

### Generación de Reportes

```javascript
function generateReport() {
  const allSections = window.allSections || [];
  
  const report = {
    clientId: window.clientId,
    companyName: window.company.name,
    generatedAt: new Date().toISOString(),
    sections: allSections.map(section => ({
      id: section.id,
      enabled: section.enabled,
      order: section.order,
      hasData: section.data && Object.keys(section.data).length > 0,
      dataFields: section.data ? Object.keys(section.data) : []
    })),
    summary: {
      totalSections: allSections.length,
      enabledSections: allSections.filter(s => s.enabled).length,
      sectionsWithData: allSections.filter(s => s.data && Object.keys(s.data).length > 0).length
    }
  };
  
  return report;
}
```

## 📝 Notas Importantes

1. **Datos Siempre Disponibles**: Todos los datos están disponibles independientemente del estado de la sección
2. **Rendimiento**: Los datos se cargan una vez al renderizar la página
3. **Seguridad**: Los datos están disponibles en el frontend, no incluir información sensible
4. **Compatibilidad**: Funciona con todos los estilos de template (clásico, moderno, minimalista, colorido)

## 🔗 Endpoints Relacionados

- `GET /api/v1/client-templates/:clientId/all-sections-data` - Obtener todos los datos via API
- `GET /api/v1/client-templates/:clientId` - Renderizar página con todos los datos
- `GET /api/v1/client-templates/:clientId/section/:sectionId` - Renderizar sección individual con todos los datos
