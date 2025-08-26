# Ejemplos de PowerShell para Probar Endpoints

## Configuración Base

```powershell
$baseUrl = "http://localhost:3002/api/v1"
```

## 1. Obtener Secciones Disponibles

```powershell
Invoke-WebRequest -Uri "$baseUrl/client-templates/available-sections" -Method GET
```

## 2. Listar Todas las Configuraciones de Clientes

```powershell
Invoke-WebRequest -Uri "$baseUrl/client-templates" -Method GET
```

## 3. Crear Nueva Configuración de Cliente

```powershell
$body = @{
  clientId = "mi-cliente"
  name = "Mi Empresa"
  description = "Descripción de mi empresa"
  style = "colorido"
  sections = @(
    @{
      id = "hero"
      enabled = $true
      order = 1
      data = @{
        title = "Mi Empresa"
        subtitle = "Soluciones innovadoras para tu negocio"
        backgroundImage = "/images/hero-bg.jpg"
        ctaButtons = @(
          @{
            text = "Ver Servicios"
            href = "#services"
            style = "primary"
          },
          @{
            text = "Contactar"
            href = "#contact"
            style = "outline"
          }
        )
      }
    },
    @{
      id = "services"
      enabled = $true
      order = 2
      data = @{
        title = "Nuestros Servicios"
        subtitle = "Servicios especializados para tu negocio"
        services = @(
          @{
            id = "consultoria"
            name = "Consultoría Empresarial"
            description = "Análisis estratégico y planificación para optimizar tu negocio."
            icon = "📊"
            price = "Desde $500.00"
          },
          @{
            id = "marketing"
            name = "Marketing Digital"
            description = "Estrategias de marketing online para aumentar tu presencia digital."
            icon = "📱"
            price = "Desde $300.00"
          }
        )
      }
    }
  )
  company = @{
    name = "Mi Empresa"
    tagline = "Soluciones innovadoras"
    description = "Descripción completa de la empresa"
    logo = "/images/logo.png"
    favicon = "/favicon.ico"
  }
  theme = @{
    colors = @{
      primary = "45 100% 51%"
      primaryForeground = "0 0% 100%"
      secondary = "142 76% 36%"
      secondaryForeground = "0 0% 100%"
      background = "0 0% 100%"
      foreground = "222.2 84% 4.9%"
      accent = "330 100% 50%"
      accentForeground = "0 0% 100%"
    }
    fonts = @{
      heading = "'Fredoka One', cursive"
      body = "'Nunito', sans-serif"
    }
  }
} | ConvertTo-Json -Depth 10

Invoke-WebRequest -Uri "$baseUrl/client-templates" -Method POST -Body $body -ContentType "application/json"
```

## 4. Obtener Configuración de Cliente Específico (JSON)

```powershell
Invoke-WebRequest -Uri "$baseUrl/client-templates/mi-cliente/configuration" -Method GET
```

## 5. Renderizar Plantilla de Cliente (HTML)

```powershell
Invoke-WebRequest -Uri "$baseUrl/client-templates/mi-cliente" -Method GET
```

## 6. Previsualizar Plantilla con Datos de Ejemplo

```powershell
Invoke-WebRequest -Uri "$baseUrl/client-templates/mi-cliente/preview" -Method GET
```

## 7. Renderizar con Datos Personalizados (sin guardar)

```powershell
$customData = @{
  hero = @{
    title = "Título Personalizado"
    subtitle = "Subtítulo personalizado"
    backgroundImage = "/images/custom-bg.jpg"
    ctaButtons = @(
      @{
        text = "Botón Personalizado"
        href = "#custom"
        style = "primary"
      }
    )
  }
} | ConvertTo-Json -Depth 5

Invoke-WebRequest -Uri "$baseUrl/client-templates/mi-cliente/render" -Method POST -Body $customData -ContentType "application/json"
```

## 8. Actualizar Configuración de Cliente

```powershell
$updateBody = @{
  name = "Mi Empresa Actualizada"
  description = "Descripción actualizada"
  style = "moderno"
  sections = @(
    @{
      id = "hero"
      enabled = $true
      order = 1
      data = @{
        title = "Título Actualizado"
        subtitle = "Subtítulo actualizado"
        backgroundImage = "/images/updated-bg.jpg"
        ctaButtons = @(
          @{
            text = "Botón Actualizado"
            href = "#updated"
            style = "primary"
          }
        )
      }
    }
  )
  company = @{
    name = "Mi Empresa Actualizada"
    tagline = "Tagline actualizado"
    description = "Descripción actualizada"
    logo = "/images/updated-logo.png"
    favicon = "/favicon-updated.ico"
  }
  theme = @{
    colors = @{
      primary = "220 14% 96%"
      primaryForeground = "220 9% 46%"
      secondary = "220 14% 96%"
      secondaryForeground = "220 9% 46%"
      background = "0 0% 100%"
      foreground = "220 9% 46%"
      accent = "220 14% 96%"
      accentForeground = "220 9% 46%"
    }
    fonts = @{
      heading = "'Inter', sans-serif"
      body = "'Inter', sans-serif"
    }
  }
} | ConvertTo-Json -Depth 10

Invoke-WebRequest -Uri "$baseUrl/client-templates/mi-cliente" -Method PUT -Body $updateBody -ContentType "application/json"
```

## 9. Eliminar Configuración de Cliente

```powershell
Invoke-WebRequest -Uri "$baseUrl/client-templates/mi-cliente" -Method DELETE
```

## 10. Ejemplo Completo con Todas las Secciones

```powershell
$completeBody = @{
  clientId = "cliente-completo"
  name = "Empresa Completa"
  description = "Empresa con todas las secciones"
  style = "colorido"
  sections = @(
    @{
      id = "hero"
      enabled = $true
      order = 1
      data = @{
        title = "Empresa Completa"
        subtitle = "Soluciones integrales"
        backgroundImage = "/images/hero-bg.jpg"
        ctaButtons = @(
          @{
            text = "Ver Productos"
            href = "#products"
            style = "primary"
          },
          @{
            text = "Contactar"
            href = "#contact"
            style = "outline"
          }
        )
      }
    },
    @{
      id = "about"
      enabled = $true
      order = 2
      data = @{
        title = "Sobre Nosotros"
        content = @(
          "Somos una empresa con más de 10 años de experiencia.",
          "Nuestro equipo está comprometido con la excelencia.",
          "Ofrecemos soluciones personalizadas."
        )
        image = "/images/about-us.jpg"
        imageAlt = "Nuestro equipo trabajando"
      }
    },
    @{
      id = "products"
      enabled = $true
      order = 3
      data = @{
        title = "Nuestro Catálogo"
        subtitle = "Descubre nuestra colección única"
        featuredProducts = @(
          @{
            id = "producto-premium"
            name = "Producto Premium"
            description = "Descripción detallada del producto premium."
            price = 199.99
            image = "/images/producto-premium.jpg"
            imageAlt = "Producto Premium"
            category = "Premium"
            features = @(
              "Calidad superior",
              "Garantía de 2 años",
              "Envío gratuito",
              "Soporte 24/7"
            )
          }
        )
        categories = @("Básico", "Premium", "Profesional")
      }
    },
    @{
      id = "services"
      enabled = $true
      order = 4
      data = @{
        title = "Nuestros Servicios"
        subtitle = "Servicios especializados"
        services = @(
          @{
            id = "consultoria"
            name = "Consultoría Empresarial"
            description = "Análisis estratégico y planificación."
            icon = "📊"
            price = "Desde $500.00"
          },
          @{
            id = "marketing"
            name = "Marketing Digital"
            description = "Estrategias de marketing online."
            icon = "📱"
            price = "Desde $300.00"
          }
        )
      }
    },
    @{
      id = "testimonials"
      enabled = $true
      order = 5
      data = @{
        title = "Lo que dicen nuestros clientes"
        subtitle = "Testimonios de clientes satisfechos"
        reviews = @(
          @{
            id = "review-1"
            name = "María García"
            role = "CEO, TechCorp"
            content = "Excelente servicio y resultados superiores."
            rating = 5
            image = "/images/cliente-1.jpg"
          }
        )
      }
    },
    @{
      id = "contact"
      enabled = $true
      order = 6
      data = @{
        title = "Contáctanos"
        subtitle = "Estamos aquí para ayudarte"
        info = @{
          address = "Calle Principal 123, Ciudad, País"
          phone = "+1 234 567 890"
          email = "contacto@miempresa.com"
          hours = "Lun-Vie: 9:00 AM - 6:00 PM"
        }
        map = @{
          latitude = 40.7128
          longitude = -74.0060
          zoom = 15
        }
      }
    }
  )
  company = @{
    name = "Empresa Completa"
    tagline = "Soluciones integrales"
    description = "Descripción completa de la empresa"
    logo = "/images/logo.png"
    favicon = "/favicon.ico"
  }
  theme = @{
    colors = @{
      primary = "45 100% 51%"
      primaryForeground = "0 0% 100%"
      secondary = "142 76% 36%"
      secondaryForeground = "0 0% 100%"
      background = "0 0% 100%"
      foreground = "222.2 84% 4.9%"
      accent = "330 100% 50%"
      accentForeground = "0 0% 100%"
    }
    fonts = @{
      heading = "'Fredoka One', cursive"
      body = "'Nunito', sans-serif"
    }
  }
} | ConvertTo-Json -Depth 10

Invoke-WebRequest -Uri "$baseUrl/client-templates" -Method POST -Body $completeBody -ContentType "application/json"
```

## Notas Importantes

1. **Puerto**: Asegúrate de que el servidor esté ejecutándose en el puerto 3002
2. **Formato JSON**: PowerShell convierte automáticamente los objetos a JSON
3. **Profundidad**: Usa `-Depth 10` para asegurar que se serialicen todos los niveles
4. **Content-Type**: Siempre especifica `application/json` para las peticiones POST/PUT
5. **Respuestas**: Las respuestas incluyen el contenido en la propiedad `Content`

## Verificar Estado del Servidor

```powershell
# Verificar si el puerto está en uso
netstat -ano | findstr :3002

# Verificar si el proceso está ejecutándose
Get-Process | Where-Object {$_.ProcessName -like "*node*"}
```
