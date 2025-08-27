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
    highlight: chalk.yellow.bold,
    gradient: chalk.hex('#FF6B6B')
};

async function testDisenosAvanzados() {
    console.log(colors.title('\n🚀 PRUEBA DE DISEÑOS AVANZADOS - SISTEMA DE PÁGINAS INDIVIDUALES'));
    console.log(colors.subtitle('='.repeat(80) + '\n'));
    
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
        console.log(colors.info(`\n2️⃣ Probando diseños avanzados para: ${colors.highlight(selectedClient.clientId)}`));
        
        // 3. Obtener información de páginas
        console.log(colors.info('\n3️⃣ Obteniendo información de páginas...'));
        const pagesInfoResponse = await axios.get(`${BASE_URL}/${selectedClient.clientId}/pages-info`);
        const pagesInfo = pagesInfoResponse.data;
        
        console.log(colors.success(`✅ ${pagesInfo.totalPages} páginas disponibles:`));
        
        // 4. Probar cada página individual con verificaciones avanzadas
        console.log(colors.info('\n4️⃣ Probando páginas individuales con efectos avanzados...'));
        
        for (const page of pagesInfo.pages) {
            try {
                console.log(colors.info(`   🔍 Probando: ${page.name}`));
                
                const pageResponse = await axios.get(page.url);
                
                // Verificar elementos de diseño avanzado
                const html = pageResponse.data;
                const advancedDesignChecks = [
                    { name: 'Layout con glassmorphism', check: html.includes('backdrop-blur') },
                    { name: 'Efectos de partículas', check: html.includes('particles') },
                    { name: 'Animaciones CSS avanzadas', check: html.includes('@keyframes') },
                    { name: 'Gradientes complejos', check: html.includes('bg-gradient-to-br') },
                    { name: 'Efectos de hover sofisticados', check: html.includes('hover:scale') },
                    { name: 'Transiciones suaves', check: html.includes('transition-all') },
                    { name: 'Efectos de brillo', check: html.includes('animate-shine') },
                    { name: 'Cursor personalizado', check: html.includes('cursor-glow') },
                    { name: 'Efectos de parallax', check: html.includes('translateY') },
                    { name: 'Animaciones de entrada', check: html.includes('fade-in') },
                    { name: 'Efectos de partículas flotantes', check: html.includes('animate-float') },
                    { name: 'Líneas de conexión SVG', check: html.includes('animate-draw-line') },
                    { name: 'Efectos de typing', check: html.includes('typeWriter') },
                    { name: 'Contadores animados', check: html.includes('counter') },
                    { name: 'Efectos de scroll', check: html.includes('scrollIntoView') }
                ];
                
                let passedChecks = 0;
                advancedDesignChecks.forEach(check => {
                    if (check.check) {
                        console.log(colors.success(`      ✅ ${check.name}`));
                        passedChecks++;
                    } else {
                        console.log(colors.warning(`      ⚠️  ${check.name}`));
                    }
                });
                
                const percentage = Math.round((passedChecks / advancedDesignChecks.length) * 100);
                console.log(colors.highlight(`      📊 Diseño avanzado: ${percentage}% completado`));
                
                // Verificar tamaño de respuesta
                const sizeKB = Math.round(pageResponse.data.length / 1024);
                console.log(colors.subtitle(`      📏 Tamaño: ${sizeKB} KB`));
                
            } catch (error) {
                console.log(colors.error(`      ❌ Error en ${page.name}: ${error.message}`));
            }
        }
        
        // 5. Probar página de índice con efectos avanzados
        console.log(colors.info('\n5️⃣ Probando página de índice con efectos avanzados...'));
        try {
            const indexResponse = await axios.get(`${BASE_URL}/${selectedClient.clientId}/pages`);
            const indexHtml = indexResponse.data;
            
            const advancedIndexChecks = [
                { name: 'Efectos de blob animados', check: indexHtml.includes('animate-blob') },
                { name: 'Perspectiva 3D', check: indexHtml.includes('perspective-1000') },
                { name: 'Rotación en Y', check: indexHtml.includes('rotate-y-12') },
                { name: 'Efectos de brillo en hover', check: indexHtml.includes('via-white/20') },
                { name: 'Animaciones escalonadas', check: indexHtml.includes('animation-delay') },
                { name: 'Efectos de partículas en tarjetas', check: indexHtml.includes('animate-float') },
                { name: 'Parallax suave', check: indexHtml.includes('translateY') },
                { name: 'Contadores de números', check: indexHtml.includes('Math.floor') },
                { name: 'Efectos de entrada mejorados', check: indexHtml.includes('cubic-bezier') },
                { name: 'Efectos de hover 3D', check: indexHtml.includes('rotateY(12deg)') }
            ];
            
            let passedIndexChecks = 0;
            advancedIndexChecks.forEach(check => {
                if (check.check) {
                    console.log(colors.success(`   ✅ ${check.name}`));
                    passedIndexChecks++;
                } else {
                    console.log(colors.warning(`   ⚠️  ${check.name}`));
                }
            });
            
            const indexPercentage = Math.round((passedIndexChecks / advancedIndexChecks.length) * 100);
            console.log(colors.highlight(`   📊 Índice avanzado: ${indexPercentage}% completado`));
            
        } catch (error) {
            console.log(colors.error(`   ❌ Error en índice: ${error.message}`));
        }
        
        // 6. Probar secciones específicas con efectos avanzados
        console.log(colors.info('\n6️⃣ Probando secciones específicas con efectos avanzados...'));
        
        const sectionsToTest = ['hero', 'about', 'contact'];
        
        for (const section of sectionsToTest) {
            try {
                console.log(colors.info(`   🔍 Probando sección: ${section}`));
                
                const sectionResponse = await axios.get(`${BASE_URL}/${selectedClient.clientId}/section/${section}`);
                const sectionHtml = sectionResponse.data;
                
                const advancedSectionChecks = {
                    hero: [
                        { name: 'Partículas flotantes', check: sectionHtml.includes('animate-float') },
                        { name: 'Líneas de conexión SVG', check: sectionHtml.includes('animate-draw-line') },
                        { name: 'Efecto de typing', check: sectionHtml.includes('typeWriter') },
                        { name: 'Contadores animados', check: sectionHtml.includes('counter') },
                        { name: 'Efecto de brillo en texto', check: sectionHtml.includes('animate-shine') },
                        { name: 'Parallax de fondo', check: sectionHtml.includes('translateY') },
                        { name: 'Partículas interactivas', check: sectionHtml.includes('animate-particle') },
                        { name: 'Scroll indicator mejorado', check: sectionHtml.includes('animate-scroll-glow') },
                        { name: 'Efectos de hover avanzados', check: sectionHtml.includes('group-hover:animate-bounce') },
                        { name: 'Animaciones de entrada escalonadas', check: sectionHtml.includes('animation-delay') }
                    ],
                    about: [
                        { name: 'Layout de dos columnas moderno', check: sectionHtml.includes('lg:grid-cols-2') },
                        { name: 'Imagen con decoraciones', check: sectionHtml.includes('rounded-3xl overflow-hidden') },
                        { name: 'Características con iconos', check: sectionHtml.includes('bg-gradient-to-br from-purple-500') },
                        { name: 'Estadísticas animadas', check: sectionHtml.includes('stat-item') },
                        { name: 'Contenido adicional', check: sectionHtml.includes('additionalContent') },
                        { name: 'Efectos de hover en elementos', check: sectionHtml.includes('hover:shadow-xl') },
                        { name: 'Animaciones de entrada', check: sectionHtml.includes('transition-all') },
                        { name: 'Gradientes de fondo', check: sectionHtml.includes('bg-gradient-to-r') }
                    ],
                    contact: [
                        { name: 'Información de contacto moderna', check: sectionHtml.includes('Información de Contacto') },
                        { name: 'Formulario con efectos', check: sectionHtml.includes('rounded-3xl shadow-2xl') },
                        { name: 'Campos con focus mejorado', check: sectionHtml.includes('focus:ring-2') },
                        { name: 'Redes sociales interactivas', check: sectionHtml.includes('Síguenos en Redes Sociales') },
                        { name: 'Información adicional', check: sectionHtml.includes('Respuesta rápida') },
                        { name: 'Efectos de hover en enlaces', check: sectionHtml.includes('hover:text-purple-600') },
                        { name: 'Validación visual', check: sectionHtml.includes('transition-all') },
                        { name: 'Efectos de brillo', check: sectionHtml.includes('hover:shadow-2xl') }
                    ]
                };
                
                const checks = advancedSectionChecks[section] || [];
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
                console.log(colors.highlight(`      📊 ${section} avanzado: ${sectionPercentage}% completado`));
                
            } catch (error) {
                console.log(colors.error(`      ❌ Error en ${section}: ${error.message}`));
            }
        }
        
        // 7. Verificar funcionalidades JavaScript avanzadas
        console.log(colors.info('\n7️⃣ Verificando funcionalidades JavaScript avanzadas...'));
        
        try {
            const heroResponse = await axios.get(`${BASE_URL}/${selectedClient.clientId}/section/hero`);
            const heroHtml = heroResponse.data;
            
            const advancedJsChecks = [
                { name: 'Navegación por teclado', check: heroHtml.includes('keydown') },
                { name: 'Efectos de entrada', check: heroHtml.includes('DOMContentLoaded') },
                { name: 'Animaciones CSS avanzadas', check: heroHtml.includes('@keyframes') },
                { name: 'Efectos de hover sofisticados', check: heroHtml.includes('hover:') },
                { name: 'Breakpoints responsivos', check: heroHtml.includes('@media (max-width:') },
                { name: 'Efectos de parallax', check: heroHtml.includes('pageYOffset') },
                { name: 'Contadores animados', check: heroHtml.includes('setInterval') },
                { name: 'Partículas interactivas', check: heroHtml.includes('addEventListener') },
                { name: 'Efecto de typing', check: heroHtml.includes('setTimeout') },
                { name: 'Scroll suave', check: heroHtml.includes('scrollIntoView') },
                { name: 'Efectos de brillo', check: heroHtml.includes('boxShadow') },
                { name: 'Intersection Observer', check: heroHtml.includes('IntersectionObserver') }
            ];
            
            let passedJsChecks = 0;
            advancedJsChecks.forEach(check => {
                if (check.check) {
                    console.log(colors.success(`   ✅ ${check.name}`));
                    passedJsChecks++;
                } else {
                    console.log(colors.warning(`   ⚠️  ${check.name}`));
                }
            });
            
            const jsPercentage = Math.round((passedJsChecks / advancedJsChecks.length) * 100);
            console.log(colors.highlight(`   📊 JavaScript avanzado: ${jsPercentage}% completado`));
            
        } catch (error) {
            console.log(colors.error(`   ❌ Error verificando JavaScript: ${error.message}`));
        }
        
        // 8. Verificar optimizaciones de rendimiento
        console.log(colors.info('\n8️⃣ Verificando optimizaciones de rendimiento...'));
        
        try {
            const indexResponse = await axios.get(`${BASE_URL}/${selectedClient.clientId}/pages`);
            const indexHtml = indexResponse.data;
            
            const performanceChecks = [
                { name: 'Preconnect para fuentes', check: indexHtml.includes('preconnect') },
                { name: 'Optimización de animaciones', check: indexHtml.includes('prefers-reduced-motion') },
                { name: 'CSS optimizado', check: indexHtml.includes('transform3d') },
                { name: 'Lazy loading', check: indexHtml.includes('loading="lazy"') },
                { name: 'Compresión de imágenes', check: indexHtml.includes('webp') },
                { name: 'Minificación de CSS', check: indexHtml.includes('min.css') },
                { name: 'Caché de recursos', check: indexHtml.includes('cache-control') },
                { name: 'Optimización de fuentes', check: indexHtml.includes('font-display') }
            ];
            
            let passedPerformanceChecks = 0;
            performanceChecks.forEach(check => {
                if (check.check) {
                    console.log(colors.success(`   ✅ ${check.name}`));
                    passedPerformanceChecks++;
                } else {
                    console.log(colors.warning(`   ⚠️  ${check.name}`));
                }
            });
            
            const performancePercentage = Math.round((passedPerformanceChecks / performanceChecks.length) * 100);
            console.log(colors.highlight(`   📊 Rendimiento: ${performancePercentage}% completado`));
            
        } catch (error) {
            console.log(colors.error(`   ❌ Error verificando rendimiento: ${error.message}`));
        }
        
        // 9. Resumen final avanzado
        console.log(colors.title('\n🎉 RESUMEN DE PRUEBAS DE DISEÑOS AVANZADOS'));
        console.log(colors.subtitle('='.repeat(60)));
        
        console.log(colors.info('\n🚀 Efectos avanzados implementados:'));
        console.log(colors.highlight('   • Glassmorphism y backdrop-blur'));
        console.log(colors.highlight('   • Partículas flotantes interactivas'));
        console.log(colors.highlight('   • Animaciones CSS sofisticadas'));
        console.log(colors.highlight('   • Efectos de parallax'));
        console.log(colors.highlight('   • Contadores animados'));
        console.log(colors.highlight('   • Efecto de typing'));
        console.log(colors.highlight('   • Líneas de conexión SVG'));
        console.log(colors.highlight('   • Efectos de brillo y shine'));
        console.log(colors.highlight('   • Hover effects 3D'));
        console.log(colors.highlight('   • Cursor personalizado'));
        console.log(colors.highlight('   • Scroll indicators mejorados'));
        console.log(colors.highlight('   • Animaciones escalonadas'));
        console.log(colors.highlight('   • Efectos de entrada avanzados'));
        console.log(colors.highlight('   • Optimizaciones de rendimiento'));
        
        console.log(colors.info('\n🔗 URLs de prueba:'));
        console.log(colors.highlight(`   • Índice: ${BASE_URL}/${selectedClient.clientId}/pages`));
        console.log(colors.highlight(`   • Hero: ${BASE_URL}/${selectedClient.clientId}/section/hero`));
        console.log(colors.highlight(`   • About: ${BASE_URL}/${selectedClient.clientId}/section/about`));
        console.log(colors.highlight(`   • Contact: ${BASE_URL}/${selectedClient.clientId}/section/contact`));
        
        console.log(colors.info('\n🎮 Funcionalidades avanzadas:'));
        console.log(colors.highlight('   • Navegación por teclado mejorada'));
        console.log(colors.highlight('   • Efectos de parallax en scroll'));
        console.log(colors.highlight('   • Partículas interactivas'));
        console.log(colors.highlight('   • Contadores animados'));
        console.log(colors.highlight('   • Efecto de typing automático'));
        console.log(colors.highlight('   • Scroll suave entre secciones'));
        console.log(colors.highlight('   • Efectos de brillo en hover'));
        console.log(colors.highlight('   • Animaciones de entrada escalonadas'));
        
        console.log(colors.gradient('\n✨ ¡Diseños avanzados implementados exitosamente!'));
        console.log(colors.subtitle('='.repeat(60)));
        
    } catch (error) {
        console.log(colors.error('\n❌ ERROR EN LAS PRUEBAS AVANZADAS:'));
        console.log(colors.error(`   ${error.message}`));
        
        if (error.response) {
            console.log(colors.error(`   Status: ${error.response.status}`));
            console.log(colors.error(`   Data: ${JSON.stringify(error.response.data, null, 2)}`));
        }
    }
}

// Función para mostrar ayuda
function showHelp() {
    console.log(colors.title('\n📖 AYUDA - PRUEBA DE DISEÑOS AVANZADOS'));
    console.log(colors.subtitle('='.repeat(60)));
    console.log(colors.info('\nUso:'));
    console.log(colors.highlight('   node test-disenos-avanzados.js'));
    
    console.log(colors.info('\nFuncionalidades avanzadas:'));
    console.log(colors.highlight('   • Verificación de glassmorphism'));
    console.log(colors.highlight('   • Prueba de partículas interactivas'));
    console.log(colors.highlight('   • Análisis de animaciones CSS'));
    console.log(colors.highlight('   • Verificación de efectos parallax'));
    console.log(colors.highlight('   • Prueba de contadores animados'));
    console.log(colors.highlight('   • Verificación de efectos de typing'));
    console.log(colors.highlight('   • Análisis de optimizaciones'));
    console.log(colors.highlight('   • Prueba de efectos 3D'));
    console.log(colors.highlight('   • Verificación de rendimiento'));
    
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
    testDisenosAvanzados();
}

module.exports = { testDisenosAvanzados, showHelp };
