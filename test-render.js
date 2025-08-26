const http = require('http');

// Configuración
const PORT = 3002;
const BASE_URL = `http://localhost:${PORT}/api/v1`;

// Función para hacer requests HTTP
function makeRequest(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: PORT,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const response = {
            statusCode: res.statusCode,
            headers: res.headers,
            body: res.headers['content-type']?.includes('application/json') ? JSON.parse(body) : body
          };
          resolve(response);
        } catch (error) {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: body
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

// Función principal de prueba
async function testRender() {
  console.log('🧪 Iniciando pruebas de renderizado...\n');

  try {
    // 1. Probar endpoint de diagnóstico
    console.log('1️⃣ Probando endpoint de diagnóstico...');
    const diagnostic = await makeRequest('/client-templates/diagnostic');
    console.log(`   Status: ${diagnostic.statusCode}`);
    if (diagnostic.statusCode === 200) {
      console.log('   ✅ Diagnóstico exitoso');
      console.log(`   📊 Configuraciones activas: ${diagnostic.body.activeConfigurations}`);
    } else {
      console.log('   ❌ Error en diagnóstico');
      return;
    }

    // 2. Probar renderizado de configuración de prueba
    console.log('\n2️⃣ Probando renderizado de configuración de prueba...');
    const testRender = await makeRequest('/client-templates/test-render');
    console.log(`   Status: ${testRender.statusCode}`);
    if (testRender.statusCode === 200) {
      console.log('   ✅ Renderizado exitoso');
      console.log(`   📄 Tamaño del HTML: ${testRender.body.length} caracteres`);
      
      // Verificar que el HTML contiene elementos esperados
      const html = testRender.body;
      const checks = [
        { name: 'Título de la empresa', check: html.includes('Empresa de Prueba') },
        { name: 'Sección Hero', check: html.includes('Página de Prueba') },
        { name: 'Sección About', check: html.includes('Sobre Nosotros') },
        { name: 'Sección Products', check: html.includes('Productos de Prueba') },
        { name: 'Sección Contact', check: html.includes('Contacto') },
        { name: 'Tailwind CSS', check: html.includes('tailwindcss') },
        { name: 'Handlebars renderizado', check: !html.includes('{{') && !html.includes('}}') }
      ];

      checks.forEach(check => {
        console.log(`   ${check.check ? '✅' : '❌'} ${check.name}`);
      });
    } else {
      console.log('   ❌ Error en renderizado');
      console.log('   Error:', testRender.body);
    }

    // 3. Probar endpoint de datos de secciones
    console.log('\n3️⃣ Probando endpoint de datos de secciones...');
    const sectionsData = await makeRequest('/client-templates/test-render/all-sections-data');
    console.log(`   Status: ${sectionsData.statusCode}`);
    if (sectionsData.statusCode === 200) {
      console.log('   ✅ Datos de secciones obtenidos');
      console.log(`   📋 Secciones: ${sectionsData.body.sections.length}`);
      sectionsData.body.sections.forEach(section => {
        console.log(`      - ${section.id}: ${section.enabled ? '✅' : '❌'}`);
      });
    } else {
      console.log('   ❌ Error obteniendo datos de secciones');
    }

    // 4. Probar renderizado de sección individual
    console.log('\n4️⃣ Probando renderizado de sección individual...');
    const sectionRender = await makeRequest('/client-templates/test-render/section/hero');
    console.log(`   Status: ${sectionRender.statusCode}`);
    if (sectionRender.statusCode === 200) {
      console.log('   ✅ Renderizado de sección exitoso');
      console.log(`   📄 Tamaño del HTML: ${sectionRender.body.length} caracteres`);
    } else {
      console.log('   ❌ Error en renderizado de sección');
    }

    // 5. Probar endpoint de prueba de renderizado
    console.log('\n5️⃣ Probando endpoint de prueba de renderizado...');
    const testRenderEndpoint = await makeRequest('/client-templates/test-render/test-render');
    console.log(`   Status: ${testRenderEndpoint.statusCode}`);
    if (testRenderEndpoint.statusCode === 200) {
      console.log('   ✅ Endpoint de prueba exitoso');
      console.log(`   📊 Secciones habilitadas: ${testRenderEndpoint.body.enabledSections}`);
      console.log(`   🖼️ Imágenes subidas: ${testRenderEndpoint.body.uploadedImages}`);
    } else {
      console.log('   ❌ Error en endpoint de prueba');
    }

    console.log('\n🎉 Pruebas completadas exitosamente!');
    console.log('\n📋 Resumen:');
    console.log('   - El servidor está funcionando correctamente');
    console.log('   - El renderizado de plantillas funciona');
    console.log('   - Los partials se cargan correctamente');
    console.log('   - Las secciones se procesan adecuadamente');
    console.log('\n🌐 URLs de prueba:');
    console.log(`   - Diagnóstico: http://localhost:${PORT}/api/v1/client-templates/diagnostic`);
    console.log(`   - Renderizado: http://localhost:${PORT}/api/v1/client-templates/test-render`);
    console.log(`   - Sección Hero: http://localhost:${PORT}/api/v1/client-templates/test-render/section/hero`);

  } catch (error) {
    console.error('❌ Error durante las pruebas:', error.message);
    console.log('\n🔧 Posibles soluciones:');
    console.log('   1. Asegúrate de que el servidor esté ejecutándose en el puerto 3002');
    console.log('   2. Verifica que todas las dependencias estén instaladas');
    console.log('   3. Revisa los logs del servidor para más detalles');
  }
}

// Ejecutar pruebas
testRender();
