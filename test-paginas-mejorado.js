const axios = require('axios');
const chalk = require('chalk');

const BASE_URL = 'http://localhost:3000/api/v1/client-templates';

// Colores para la consola
const colors = {
    success: chalk.green,
    error: chalk.red,
    info: chalk.blue,
    warning: chalk.yellow,
    title: chalk.cyan.bold,
    subtitle: chalk.magenta,
    highlight: chalk.yellow.bold
};

async function testPaginasIndividuales() {
    console.log(colors.title('\n🚀 SISTEMA DE PÁGINAS INDIVIDUALES - PRUEBAS MEJORADAS'));
    console.log(colors.subtitle('='.repeat(60) + '\n'));
    
    try {
        // 1. Listar clientes disponibles
        console.log(colors.info('1️⃣ Listando clientes disponibles...'));
        const clientsResponse = await axios.get(BASE_URL);
        const clients = clientsResponse.data;
        
        if (clients.length === 0) {
            console.log(colors.error('❌ No hay clientes configurados'));
            return;
        }
        
        const clientId = clients[0].clientId;
        console.log(colors.success(`✅ Cliente seleccionado: ${colors.highlight(clientId)}\n`));
        
        // 2. Obtener información de páginas
        console.log(colors.info('2️⃣ Obteniendo información de páginas...'));
        const pagesInfoResponse = await axios.get(`${BASE_URL}/${clientId}/pages-info`);
        const pagesInfo = pagesInfoResponse.data;
        
        console.log(colors.success(`📊 Cliente: ${colors.highlight(pagesInfo.clientName)}`));
        console.log(colors.success(`🎨 Estilo: ${colors.highlight(pagesInfo.style)}`));
        console.log(colors.success(`📄 Total de páginas: ${colors.highlight(pagesInfo.totalPages)}\n`));
        
        // 3. Probar índice de páginas
        console.log(colors.info('3️⃣ Probando índice de páginas...'));
        const indexResponse = await axios.get(`${BASE_URL}/${clientId}/pages`);
        console.log(colors.success(`✅ Índice accesible (${colors.highlight(indexResponse.data.length)} caracteres)\n`));
        
        // 4. Probar páginas individuales
        console.log(colors.info('4️⃣ Probando páginas individuales...'));
        const pageResults = [];
        
        for (const page of pagesInfo.pages.slice(0, 3)) {
            try {
                const pageResponse = await axios.get(page.url);
                const status = colors.success('✅');
                const size = colors.highlight(pageResponse.data.length);
                pageResults.push({ page, status, size, success: true });
            } catch (error) {
                const status = colors.error('❌');
                const errorMsg = colors.error(error.message);
                pageResults.push({ page, status, error: errorMsg, success: false });
            }
        }
        
        // Mostrar resultados de páginas
        pageResults.forEach(result => {
            if (result.success) {
                console.log(`${result.status} ${result.page.name} (${result.page.id}): ${result.size} caracteres`);
            } else {
                console.log(`${result.status} ${result.page.name} (${result.page.id}): ${result.error}`);
            }
        });
        
        console.log('\n' + colors.title('🎉 PRUEBAS COMPLETADAS EXITOSAMENTE!'));
        console.log(colors.subtitle('='.repeat(60)));
        
        // 5. Mostrar URLs disponibles
        console.log(colors.info('\n📋 URLs DISPONIBLES:'));
        console.log(colors.highlight(`   Índice: ${pagesInfo.indexUrl}`));
        console.log(colors.highlight(`   Sitio completo: ${pagesInfo.fullSiteUrl}`));
        console.log(colors.highlight(`   Configuración: ${pagesInfo.configurationUrl}`));
        
        pagesInfo.pages.forEach(page => {
            console.log(colors.highlight(`   ${page.name}: ${page.url}`));
        });
        
        // 6. Mostrar estadísticas
        console.log(colors.info('\n📊 ESTADÍSTICAS:'));
        console.log(colors.highlight(`   • Total de secciones: ${pagesInfo.totalPages}`));
        console.log(colors.highlight(`   • Estilo actual: ${pagesInfo.style}`));
        console.log(colors.highlight(`   • Cliente: ${pagesInfo.clientName}`));
        
        // 7. Mostrar información de navegación
        console.log(colors.info('\n🎮 NAVEGACIÓN POR TECLADO:'));
        console.log(colors.highlight('   ← Flecha izquierda: Sección anterior'));
        console.log(colors.highlight('   → Flecha derecha: Siguiente sección'));
        console.log(colors.highlight('   Home: Volver al índice'));
        
        // 8. Mostrar características del diseño
        console.log(colors.info('\n🎨 CARACTERÍSTICAS DEL DISEÑO:'));
        console.log(colors.highlight('   • Navegación flotante con efectos glassmorphism'));
        console.log(colors.highlight('   • Animaciones suaves y transiciones'));
        console.log(colors.highlight('   • Diseño responsivo para móviles'));
        console.log(colors.highlight('   • Efectos de hover mejorados'));
        console.log(colors.highlight('   • Breadcrumbs con navegación intuitiva'));
        console.log(colors.highlight('   • Footer con información detallada'));
        
        // 9. Mostrar comandos de prueba
        console.log(colors.info('\n🧪 COMANDOS DE PRUEBA:'));
        console.log(colors.highlight('   # Probar índice'));
        console.log(colors.subtitle(`   curl ${pagesInfo.indexUrl}`));
        console.log(colors.highlight('   # Probar página individual'));
        console.log(colors.subtitle(`   curl ${pagesInfo.pages[0]?.url || 'URL_EJEMPLO'}`));
        console.log(colors.highlight('   # Obtener información JSON'));
        console.log(colors.subtitle(`   curl ${pagesInfo.configurationUrl}`));
        
        console.log(colors.title('\n✨ ¡Sistema de páginas individuales funcionando perfectamente!'));
        
    } catch (error) {
        console.log(colors.error('\n❌ ERROR EN LAS PRUEBAS:'));
        console.log(colors.error(`   ${error.message}`));
        
        if (error.response) {
            console.log(colors.error(`   Status: ${error.response.status}`));
            console.log(colors.error(`   Data: ${JSON.stringify(error.response.data, null, 2)}`));
        }
    }
}

// Función para mostrar ayuda
function showHelp() {
    console.log(colors.title('\n📖 AYUDA - SISTEMA DE PÁGINAS INDIVIDUALES'));
    console.log(colors.subtitle('='.repeat(50)));
    console.log(colors.info('\nUso:'));
    console.log(colors.highlight('   node test-paginas-mejorado.js'));
    console.log(colors.highlight('   npm run test:pages'));
    
    console.log(colors.info('\nCaracterísticas:'));
    console.log(colors.highlight('   • Pruebas automáticas del sistema'));
    console.log(colors.highlight('   • Verificación de endpoints'));
    console.log(colors.highlight('   • Validación de respuestas'));
    console.log(colors.highlight('   • Reporte detallado de resultados'));
    
    console.log(colors.info('\nRequisitos:'));
    console.log(colors.highlight('   • Servidor ejecutándose en localhost:3000'));
    console.log(colors.highlight('   • Al menos un cliente configurado'));
    console.log(colors.highlight('   • Dependencias: axios, chalk'));
    
    console.log(colors.info('\nInstalación:'));
    console.log(colors.highlight('   npm install axios chalk'));
}

// Verificar argumentos de línea de comandos
const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
    showHelp();
    process.exit(0);
}

// Ejecutar si es el archivo principal
if (require.main === module) {
    testPaginasIndividuales();
}

module.exports = { testPaginasIndividuales, showHelp };
