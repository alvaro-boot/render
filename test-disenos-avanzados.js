const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

console.log(chalk.blue.bold('🎨 TESTING AVANZADO DE DISEÑOS MEJORADOS'));
console.log(chalk.gray('==========================================\n'));

// Función para verificar archivos
function checkFile(filePath, description) {
    try {
        if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, 'utf8');
            const hasAdvancedFeatures = {
                animateBlob: content.includes('animate-blob'),
                animateFloat: content.includes('animate-float'),
                animateTitle: content.includes('animate-title'),
                animateFadeInUp: content.includes('animate-fade-in-up'),
                animateFadeInDown: content.includes('animate-fade-in-down'),
                animateShine: content.includes('animate-shine'),
                backdropBlur: content.includes('backdrop-blur'),
                glassEffect: content.includes('bg-white/90'),
                gradientText: content.includes('bg-clip-text text-transparent'),
                hoverEffects: content.includes('group-hover:'),
                shineEffect: content.includes('animate-shine'),
                parallax: content.includes('translateY(${scrolled'),
                intersectionObserver: content.includes('IntersectionObserver'),
                counterAnimation: content.includes('counter'),
                notificationSystem: content.includes('showNotification'),
                advancedCSS: content.includes('@keyframes'),
                modernLayout: content.includes('rounded-3xl'),
                responsiveDesign: content.includes('grid-cols-1 md:grid-cols-2 lg:grid-cols-3')
            };
            
            const featureCount = Object.values(hasAdvancedFeatures).filter(Boolean).length;
            const totalFeatures = Object.keys(hasAdvancedFeatures).length;
            const percentage = Math.round((featureCount / totalFeatures) * 100);
            
            console.log(chalk.green(`✅ ${description}`));
            console.log(chalk.gray(`   Características avanzadas: ${featureCount}/${totalFeatures} (${percentage}%)`));
            
            if (featureCount >= 10) {
                console.log(chalk.cyan(`   🎯 Excelente implementación de efectos avanzados`));
            } else if (featureCount >= 7) {
                console.log(chalk.yellow(`   ⚡ Buena implementación de efectos modernos`));
            } else {
                console.log(chalk.red(`   ⚠️  Necesita más mejoras de diseño`));
            }
            
            return { success: true, features: hasAdvancedFeatures, count: featureCount };
        } else {
            console.log(chalk.red(`❌ ${description} - Archivo no encontrado`));
            return { success: false };
        }
    } catch (error) {
        console.log(chalk.red(`❌ ${description} - Error: ${error.message}`));
        return { success: false };
    }
}

// Lista de archivos a verificar
const filesToCheck = [
    {
        path: 'src/views/partials/sections/hero.hbs',
        description: 'Sección Hero - Efectos Avanzados'
    },
    {
        path: 'src/views/partials/sections/about.hbs',
        description: 'Sección About - Diseño Moderno'
    },
    {
        path: 'src/views/partials/sections/contact.hbs',
        description: 'Sección Contact - Interactividad'
    },
    {
        path: 'src/views/partials/sections/products.hbs',
        description: 'Sección Products - Animaciones'
    },
    {
        path: 'src/views/partials/sections/appointments.hbs',
        description: 'Sección Appointments - Formularios Avanzados'
    },
    {
        path: 'src/views/partials/sections/cart.hbs',
        description: 'Sección Cart - Efectos de Carrito'
    },
    {
        path: 'src/views/partials/sections/gallery.hbs',
        description: 'Sección Gallery - Galería Interactiva'
    },
    {
        path: 'src/views/partials/sections/services.hbs',
        description: 'Sección Services - Tarjetas de Servicios'
    },
    {
        path: 'src/views/partials/sections/testimonials.hbs',
        description: 'Sección Testimonials - Testimonios Avanzados'
    },
    {
        path: 'src/views/partials/sections/index.hbs',
        description: 'Página de Índice - Navegación Principal'
    },
    {
        path: 'src/views/layouts/section-page.hbs',
        description: 'Layout Principal - Estructura Base'
    }
];

console.log(chalk.blue.bold('🔍 VERIFICANDO MEJORAS DE DISEÑO AVANZADO\n'));

let totalSuccess = 0;
let totalFeatures = 0;
const results = [];

// Verificar cada archivo
filesToCheck.forEach((file, index) => {
    console.log(chalk.blue(`${index + 1}. Verificando: ${file.description}`));
    const result = checkFile(file.path, file.description);
    results.push(result);
    
    if (result.success) {
        totalSuccess++;
        totalFeatures += result.count;
    }
    
    console.log(''); // Espacio entre archivos
});

// Resumen final
console.log(chalk.blue.bold('📊 RESUMEN FINAL'));
console.log(chalk.gray('================\n'));

console.log(chalk.green(`✅ Archivos procesados exitosamente: ${totalSuccess}/${filesToCheck.length}`));
console.log(chalk.cyan(`🎨 Características avanzadas implementadas: ${totalFeatures}`));

const averageFeatures = totalSuccess > 0 ? Math.round(totalFeatures / totalSuccess) : 0;
console.log(chalk.yellow(`📈 Promedio de características por archivo: ${averageFeatures}`));

// Análisis de características más implementadas
const featureAnalysis = {};
results.forEach(result => {
    if (result.success && result.features) {
        Object.entries(result.features).forEach(([feature, implemented]) => {
            if (implemented) {
                featureAnalysis[feature] = (featureAnalysis[feature] || 0) + 1;
            }
        });
    }
});

console.log(chalk.blue('\n🏆 CARACTERÍSTICAS MÁS IMPLEMENTADAS:'));
Object.entries(featureAnalysis)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .forEach(([feature, count]) => {
        const percentage = Math.round((count / totalSuccess) * 100);
        console.log(chalk.gray(`   ${feature}: ${count} archivos (${percentage}%)`));
    });

// Recomendaciones
console.log(chalk.blue('\n💡 RECOMENDACIONES:'));
if (averageFeatures >= 10) {
    console.log(chalk.green('   🎉 Excelente trabajo! Todas las secciones tienen efectos avanzados'));
    console.log(chalk.cyan('   🚀 El sistema está listo para producción con diseño moderno'));
} else if (averageFeatures >= 7) {
    console.log(chalk.yellow('   ⚡ Buen progreso! Considera agregar más efectos interactivos'));
    console.log(chalk.cyan('   🎨 Puedes mejorar con más animaciones y transiciones'));
} else {
    console.log(chalk.red('   ⚠️  Necesitas más trabajo en los efectos visuales'));
    console.log(chalk.cyan('   🎨 Considera implementar más animaciones y efectos modernos'));
}

console.log(chalk.blue('\n🎯 PRÓXIMOS PASOS:'));
console.log(chalk.gray('   1. Probar las páginas en el navegador'));
console.log(chalk.gray('   2. Verificar la responsividad en diferentes dispositivos'));
console.log(chalk.gray('   3. Optimizar el rendimiento de las animaciones'));
console.log(chalk.gray('   4. Implementar más interacciones si es necesario'));

console.log(chalk.green.bold('\n✨ ¡VERIFICACIÓN COMPLETADA! ✨'));
