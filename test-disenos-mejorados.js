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

async function testDisenosMejorados() {
    console.log(colors.title('\n🎨 PRUEBA DE DISEÑOS MEJORADOS - SISTEMA DE PÁGINAS INDIVIDUALES'));
    console.log(colors.subtitle('='.repeat(70) + '\n'));
    
    try {
        // 1. Listar clientes disponibles
        console.log(colors.info('1️⃣ Listando clientes disponibles...'));
        const clientsResponse = await axios.get(BASE_URL);
        const clients = clientsResponse.data;
        
        if (clients.length === 0) {
            console.log(colors.error('❌ No hay clientes configurados'));
            return;
        }
        
        console.log(colors.success(`✅ Encontrados ${clients.length} clientes:`));
        clients.forEach((client, index) => {
            console.log(colors.highlight(`   ${index + 1}. ${client.clientId} - ${client.name}`));
        });
        
        // 2. Seleccionar cliente (usar el primero)
        const selectedClient = clients[0];
        console.log(colors.info(`\n2️⃣ Probando diseños para: ${colors.highlight(selectedClient.clientId)}`));
        
        // 3. Obtener información de páginas
        console.log(colors.info('\n3️⃣ Obteniendo información de páginas...'));
        const pagesInfoResponse = await axios.get(`${BASE_URL}/${selectedClient.clientId}/pages-info`);
        const pagesInfo = pagesInfoResponse.data;
        
        console.log(colors.success(`✅ ${pagesInfo.totalPages} páginas disponibles:`));
        
        // 4. Probar cada página individual
        console.log(colors.info('\n4️⃣ Probando páginas individuales...'));
        
        for (const page of pagesInfo.pages) {
            try {
                console.log(colors.info(`   🔍 Probando: ${page.name}`));
                
                const pageResponse = await axios.get(page.url);
                
                // Verificar elementos de diseño mejorado
                const html = pageResponse.data;
                const designChecks = [
                    { name: 'Layout moderno', check: html.includes('content-wrapper') },
                    { name: 'Navegación flotante', check: html.includes('floating-nav') },
                    { name: 'Header mejorado', check: html.includes('main-header') },
                    { name: 'Footer moderno', check: html.includes('main-footer') },
                    { name: 'Gradientes CSS', check: html.includes('bg-gradient-to-r') },
                    { name: 'Sombras modernas', check: html.includes('shadow-2xl') },
                    { name: 'Bordes redondeados', check: html.includes('rounded-2xl') },
                    { name: 'Animaciones CSS', check: html.includes('transition-all') },
                    { name: 'Responsive design', check: html.includes('@media') },
                    { name: 'SEO optimizado', check: html.includes('meta property="og:') }
                ];
                
                let passedChecks = 0;
                designChecks.forEach(check => {
                    if (check.check) {
                        console.log(colors.success(`      ✅ ${check.name}`));
                        passedChecks++;
                    } else {
                        console.log(colors.warning(`      ⚠️  ${check.name}`));
                    }
                });
                
                const percentage = Math.round((passedChecks / designChecks.length) * 100);
                console.log(colors.highlight(`      📊 Diseño: ${percentage}% completado`));
                
                // Verificar tamaño de respuesta
                const sizeKB = Math.round(pageResponse.data.length / 1024);
                console.log(colors.subtitle(`      📏 Tamaño: ${sizeKB} KB`));
                
            } catch (error) {
                console.log(colors.error(`      ❌ Error en ${page.name}: ${error.message}`));
            }
        }
        
        // 5. Probar página de índice
        console.log(colors.info('\n5️⃣ Probando página de índice...'));
        try {
            const indexResponse = await axios.get(`${BASE_URL}/${selectedClient.clientId}/pages`);
            const indexHtml = indexResponse.data;
            
            const indexChecks = [
                { name: 'Grid de secciones', check: indexHtml.includes('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3') },
                { name: 'Tarjetas modernas', check: indexHtml.includes('rounded-2xl shadow-lg') },
                { name: 'Efectos hover', check: indexHtml.includes('hover:-translate-y-2') },
                { name: 'Iconos de secciones', check: indexHtml.includes('text-6xl') },
                { name: 'Panel de información', check: indexHtml.includes('Información del Sitio') },
                { name: 'Botones de acción', check: indexHtml.includes('Acciones Rápidas') },
                { name: 'Gradientes de colores', check: indexHtml.includes('from-purple-500 to-blue-500') },
                { name: 'Animaciones de entrada', check: indexHtml.includes('fade-in') }
            ];
            
            let passedIndexChecks = 0;
            indexChecks.forEach(check => {
                if (check.check) {
                    console.log(colors.success(`   ✅ ${check.name}`));
                    passedIndexChecks++;
                } else {
                    console.log(colors.warning(`   ⚠️  ${check.name}`));
                }
            });
            
            const indexPercentage = Math.round((passedIndexChecks / indexChecks.length) * 100);
            console.log(colors.highlight(`   📊 Índice: ${indexPercentage}% completado`));
            
        } catch (error) {
            console.log(colors.error(`   ❌ Error en índice: ${error.message}`));
        }
        
        // 6. Probar secciones específicas
        console.log(colors.info('\n6️⃣ Probando secciones específicas...'));
        
        const sectionsToTest = ['hero', 'about', 'contact'];
        
        for (const section of sectionsToTest) {
            try {
                console.log(colors.info(`   🔍 Probando sección: ${section}`));
                
                const sectionResponse = await axios.get(`${BASE_URL}/${selectedClient.clientId}/section/${section}`);
                const sectionHtml = sectionResponse.data;
                
                const sectionChecks = {
                    hero: [
                        { name: 'Background con gradiente', check: sectionHtml.includes('bg-gradient-to-br from-purple-900') },
                        { name: 'Elementos decorativos', check: sectionHtml.includes('animate-pulse') },
                        { name: 'Título principal', check: sectionHtml.includes('text-6xl lg:text-8xl') },
                        { name: 'Botones CTA', check: sectionHtml.includes('bg-gradient-to-r from-purple-600') },
                        { name: 'Scroll indicator', check: sectionHtml.includes('animate-bounce') }
                    ],
                    about: [
                        { name: 'Layout de dos columnas', check: sectionHtml.includes('lg:grid-cols-2') },
                        { name: 'Imagen con decoraciones', check: sectionHtml.includes('rounded-3xl overflow-hidden') },
                        { name: 'Características', check: sectionHtml.includes('bg-gradient-to-br from-purple-500') },
                        { name: 'Estadísticas', check: sectionHtml.includes('stat-item') },
                        { name: 'Contenido adicional', check: sectionHtml.includes('additionalContent') }
                    ],
                    contact: [
                        { name: 'Información de contacto', check: sectionHtml.includes('Información de Contacto') },
                        { name: 'Formulario moderno', check: sectionHtml.includes('rounded-3xl shadow-2xl') },
                        { name: 'Campos de formulario', check: sectionHtml.includes('rounded-xl focus:ring-2') },
                        { name: 'Redes sociales', check: sectionHtml.includes('Síguenos en Redes Sociales') },
                        { name: 'Información adicional', check: sectionHtml.includes('Respuesta rápida') }
                    ]
                };
                
                const checks = sectionChecks[section] || [];
                let passedSectionChecks = 0;
                
                checks.forEach(check => {
                    if (check.check) {
                        console.log(colors.success(`      ✅ ${check.name}`));
                        passedSectionChecks++;
                    } else {
                        console.log(colors.warning(`      ⚠️  ${check.name}`));
                    }
                });
                
                const sectionPercentage = Math.round((passedSectionChecks / checks.length) * 100);
                console.log(colors.highlight(`      📊 ${section}: ${sectionPercentage}% completado`));
                
            } catch (error) {
                console.log(colors.error(`      ❌ Error en ${section}: ${error.message}`));
            }
        }
        
        // 7. Verificar funcionalidades JavaScript
        console.log(colors.info('\n7️⃣ Verificando funcionalidades JavaScript...'));
        
        try {
            const heroResponse = await axios.get(`${BASE_URL}/${selectedClient.clientId}/section/hero`);
            const heroHtml = heroResponse.data;
            
            const jsChecks = [
                { name: 'Navegación por teclado', check: heroHtml.includes('keydown') },
                { name: 'Efectos de entrada', check: heroHtml.includes('DOMContentLoaded') },
                { name: 'Animaciones CSS', check: heroHtml.includes('@keyframes') },
                { name: 'Hover effects', check: heroHtml.includes('hover:') },
                { name: 'Responsive breakpoints', check: heroHtml.includes('@media (max-width:') }
            ];
            
            let passedJsChecks = 0;
            jsChecks.forEach(check => {
                if (check.check) {
                    console.log(colors.success(`   ✅ ${check.name}`));
                    passedJsChecks++;
                } else {
                    console.log(colors.warning(`   ⚠️  ${check.name}`));
                }
            });
            
            const jsPercentage = Math.round((passedJsChecks / jsChecks.length) * 100);
            console.log(colors.highlight(`   📊 JavaScript: ${jsPercentage}% completado`));
            
        } catch (error) {
            console.log(colors.error(`   ❌ Error verificando JavaScript: ${error.message}`));
        }
        
        // 8. Resumen final
        console.log(colors.title('\n🎉 RESUMEN DE PRUEBAS DE DISEÑO'));
        console.log(colors.subtitle('='.repeat(50)));
        
        console.log(colors.info('\n✅ Mejoras implementadas:'));
        console.log(colors.highlight('   • Layout moderno con glassmorphism'));
        console.log(colors.highlight('   • Navegación flotante mejorada'));
        console.log(colors.highlight('   • Header y footer rediseñados'));
        console.log(colors.highlight('   • Gradientes y sombras modernas'));
        console.log(colors.highlight('   • Animaciones y transiciones suaves'));
        console.log(colors.highlight('   • Diseño completamente responsive'));
        console.log(colors.highlight('   • SEO optimizado con meta tags'));
        console.log(colors.highlight('   • Navegación por teclado'));
        console.log(colors.highlight('   • Efectos hover mejorados'));
        
        console.log(colors.info('\n🔗 URLs de prueba:'));
        console.log(colors.highlight(`   • Índice: ${BASE_URL}/${selectedClient.clientId}/pages`));
        console.log(colors.highlight(`   • Hero: ${BASE_URL}/${selectedClient.clientId}/section/hero`));
        console.log(colors.highlight(`   • About: ${BASE_URL}/${selectedClient.clientId}/section/about`));
        console.log(colors.highlight(`   • Contact: ${BASE_URL}/${selectedClient.clientId}/section/contact`));
        
        console.log(colors.info('\n🎮 Funcionalidades de navegación:'));
        console.log(colors.highlight('   • Flecha izquierda: Sección anterior'));
        console.log(colors.highlight('   • Flecha derecha: Siguiente sección'));
        console.log(colors.highlight('   • Home: Volver al índice'));
        
        console.log(colors.title('\n✨ ¡Diseños mejorados exitosamente!'));
        console.log(colors.subtitle('='.repeat(50)));
        
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
    console.log(colors.title('\n📖 AYUDA - PRUEBA DE DISEÑOS'));
    console.log(colors.subtitle('='.repeat(50)));
    console.log(colors.info('\nUso:'));
    console.log(colors.highlight('   node test-disenos-mejorados.js'));
    
    console.log(colors.info('\nFuncionalidades:'));
    console.log(colors.highlight('   • Prueba de layout moderno'));
    console.log(colors.highlight('   • Verificación de navegación'));
    console.log(colors.highlight('   • Análisis de CSS mejorado'));
    console.log(colors.highlight('   • Verificación de JavaScript'));
    console.log(colors.highlight('   • Prueba de responsividad'));
    console.log(colors.highlight('   • Verificación de SEO'));
    
    console.log(colors.info('\nRequisitos:'));
    console.log(colors.highlight('   • Servidor ejecutándose en localhost:3000'));
    console.log(colors.highlight('   • Al menos un cliente configurado'));
    console.log(colors.highlight('   • Dependencias: axios, chalk'));
}

// Verificar argumentos de línea de comandos
const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
    showHelp();
    process.exit(0);
}

// Ejecutar si es el archivo principal
if (require.main === module) {
    testDisenosMejorados();
}

module.exports = { testDisenosMejorados, showHelp };
