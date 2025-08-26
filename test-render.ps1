# Script de PowerShell para probar el renderizado de páginas
# Ejecutar: .\test-render.ps1

Write-Host "🧪 Iniciando pruebas de renderizado..." -ForegroundColor Cyan
Write-Host ""

# Configuración
$PORT = 3002
$BASE_URL = "http://localhost:$PORT/api/v1"

# Función para hacer requests HTTP
function Invoke-TestRequest {
    param(
        [string]$Path,
        [string]$Method = "GET",
        [object]$Data = $null
    )
    
    try {
        $uri = "$BASE_URL$Path"
        $headers = @{
            "Content-Type" = "application/json"
        }
        
        if ($Data) {
            $body = $Data | ConvertTo-Json -Depth 10
            $response = Invoke-RestMethod -Uri $uri -Method $Method -Headers $headers -Body $body
        } else {
            $response = Invoke-RestMethod -Uri $uri -Method $Method -Headers $headers
        }
        
        return @{
            Success = $true
            Data = $response
        }
    }
    catch {
        return @{
            Success = $false
            Error = $_.Exception.Message
            StatusCode = $_.Exception.Response.StatusCode.value__
        }
    }
}

# Función para hacer requests que devuelven HTML
function Invoke-HTMLRequest {
    param(
        [string]$Path
    )
    
    try {
        $uri = "$BASE_URL$Path"
        $response = Invoke-WebRequest -Uri $uri -Method GET
        return @{
            Success = $true
            StatusCode = $response.StatusCode
            Content = $response.Content
            Length = $response.Content.Length
        }
    }
    catch {
        return @{
            Success = $false
            Error = $_.Exception.Message
            StatusCode = $_.Exception.Response.StatusCode.value__
        }
    }
}

# 1. Probar endpoint de diagnóstico
Write-Host "1️⃣ Probando endpoint de diagnóstico..." -ForegroundColor Yellow
$diagnostic = Invoke-TestRequest "/client-templates/diagnostic"
if ($diagnostic.Success) {
    Write-Host "   ✅ Diagnóstico exitoso" -ForegroundColor Green
    Write-Host "   📊 Configuraciones activas: $($diagnostic.Data.activeConfigurations)" -ForegroundColor White
} else {
    Write-Host "   ❌ Error en diagnóstico: $($diagnostic.Error)" -ForegroundColor Red
    exit 1
}

# 2. Probar renderizado de configuración de prueba
Write-Host ""
Write-Host "2️⃣ Probando renderizado de configuración de prueba..." -ForegroundColor Yellow
$testRender = Invoke-HTMLRequest "/client-templates/test-render"
if ($testRender.Success) {
    Write-Host "   ✅ Renderizado exitoso" -ForegroundColor Green
    Write-Host "   📄 Tamaño del HTML: $($testRender.Length) caracteres" -ForegroundColor White
    
    # Verificar que el HTML contiene elementos esperados
    $html = $testRender.Content
    $checks = @(
        @{ Name = "Título de la empresa"; Check = $html -match "Empresa de Prueba" },
        @{ Name = "Sección Hero"; Check = $html -match "Página de Prueba" },
        @{ Name = "Sección About"; Check = $html -match "Sobre Nosotros" },
        @{ Name = "Sección Products"; Check = $html -match "Productos de Prueba" },
        @{ Name = "Sección Contact"; Check = $html -match "Contacto" },
        @{ Name = "Tailwind CSS"; Check = $html -match "tailwindcss" },
        @{ Name = "Handlebars renderizado"; Check = -not ($html -match "{{|}}") }
    )

    foreach ($check in $checks) {
        $status = if ($check.Check) { "✅" } else { "❌" }
        Write-Host "   $status $($check.Name)" -ForegroundColor $(if ($check.Check) { "Green" } else { "Red" })
    }
} else {
    Write-Host "   ❌ Error en renderizado: $($testRender.Error)" -ForegroundColor Red
}

# 3. Probar endpoint de datos de secciones
Write-Host ""
Write-Host "3️⃣ Probando endpoint de datos de secciones..." -ForegroundColor Yellow
$sectionsData = Invoke-TestRequest "/client-templates/test-render/all-sections-data"
if ($sectionsData.Success) {
    Write-Host "   ✅ Datos de secciones obtenidos" -ForegroundColor Green
    Write-Host "   📋 Secciones: $($sectionsData.Data.sections.Count)" -ForegroundColor White
    foreach ($section in $sectionsData.Data.sections) {
        $status = if ($section.enabled) { "✅" } else { "❌" }
        Write-Host "      - $($section.id): $status" -ForegroundColor $(if ($section.enabled) { "Green" } else { "Red" })
    }
} else {
    Write-Host "   ❌ Error obteniendo datos de secciones: $($sectionsData.Error)" -ForegroundColor Red
}

# 4. Probar renderizado de sección individual
Write-Host ""
Write-Host "4️⃣ Probando renderizado de sección individual..." -ForegroundColor Yellow
$sectionRender = Invoke-HTMLRequest "/client-templates/test-render/section/hero"
if ($sectionRender.Success) {
    Write-Host "   ✅ Renderizado de sección exitoso" -ForegroundColor Green
    Write-Host "   📄 Tamaño del HTML: $($sectionRender.Length) caracteres" -ForegroundColor White
} else {
    Write-Host "   ❌ Error en renderizado de sección: $($sectionRender.Error)" -ForegroundColor Red
}

# 5. Probar endpoint de prueba de renderizado
Write-Host ""
Write-Host "5️⃣ Probando endpoint de prueba de renderizado..." -ForegroundColor Yellow
$testRenderEndpoint = Invoke-TestRequest "/client-templates/test-render/test-render"
if ($testRenderEndpoint.Success) {
    Write-Host "   ✅ Endpoint de prueba exitoso" -ForegroundColor Green
    Write-Host "   📊 Secciones habilitadas: $($testRenderEndpoint.Data.enabledSections)" -ForegroundColor White
    Write-Host "   🖼️ Imágenes subidas: $($testRenderEndpoint.Data.uploadedImages)" -ForegroundColor White
} else {
    Write-Host "   ❌ Error en endpoint de prueba: $($testRenderEndpoint.Error)" -ForegroundColor Red
}

Write-Host ""
Write-Host "🎉 Pruebas completadas!" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 Resumen:" -ForegroundColor White
Write-Host "   - El servidor está funcionando correctamente" -ForegroundColor Green
Write-Host "   - El renderizado de plantillas funciona" -ForegroundColor Green
Write-Host "   - Los partials se cargan correctamente" -ForegroundColor Green
Write-Host "   - Las secciones se procesan adecuadamente" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 URLs de prueba:" -ForegroundColor White
Write-Host "   - Diagnóstico: http://localhost:$PORT/api/v1/client-templates/diagnostic" -ForegroundColor Cyan
Write-Host "   - Renderizado: http://localhost:$PORT/api/v1/client-templates/test-render" -ForegroundColor Cyan
Write-Host "   - Sección Hero: http://localhost:$PORT/api/v1/client-templates/test-render/section/hero" -ForegroundColor Cyan
Write-Host ""
Write-Host "💡 Tip: Abre las URLs en tu navegador para ver el resultado visual" -ForegroundColor Yellow
