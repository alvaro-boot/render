const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

console.log(chalk.blue.bold('🎨 ACTUALIZANDO TODOS LOS COLORES A DINÁMICOS'));
console.log(chalk.gray('===============================================\n'));

// Mapeo completo de colores hardcodeados a variables CSS dinámicas
const colorMappings = {
    // Gradientes principales - Purple/Blue a Primary/Secondary
    'from-purple-600 via-blue-600 to-indigo-600': 'from-[hsl(var(--primary))] via-[hsl(var(--accent))] to-[hsl(var(--secondary))]',
    'from-purple-500 to-blue-500': 'from-[hsl(var(--primary))] to-[hsl(var(--secondary))]',
    'from-purple-600 to-blue-600': 'from-[hsl(var(--primary))] to-[hsl(var(--secondary))]',
    'from-purple-700 to-blue-700': 'from-[hsl(var(--primary)/1.2)] to-[hsl(var(--secondary)/1.2)]',
    'from-purple-50 to-blue-50': 'from-[hsl(var(--primary)/0.05)] to-[hsl(var(--secondary)/0.05)]',
    'from-purple-100 to-blue-100': 'from-[hsl(var(--primary)/0.1)] to-[hsl(var(--secondary)/0.1)]',
    'from-purple-100/50 to-blue-100/50': 'from-[hsl(var(--primary)/0.1)] to-[hsl(var(--secondary)/0.1)]',
    'from-purple-700/50 to-blue-700/50': 'from-[hsl(var(--primary)/0.5)] to-[hsl(var(--secondary)/0.5)]',
    'from-purple-500 via-blue-500 to-indigo-500': 'from-[hsl(var(--primary))] via-[hsl(var(--accent))] to-[hsl(var(--secondary))]',
    'from-purple-100 via-blue-100 to-indigo-100': 'from-[hsl(var(--primary)/0.1)] via-[hsl(var(--accent)/0.1)] to-[hsl(var(--secondary)/0.1)]',
    'from-purple-500/10 to-blue-500/10': 'from-[hsl(var(--primary)/0.1)] to-[hsl(var(--secondary)/0.1)]',
    
    // Gradientes de acento - Green/Emerald a Accent/Secondary
    'from-green-500 to-emerald-500': 'from-[hsl(var(--accent))] to-[hsl(var(--secondary))]',
    'from-green-600 to-emerald-600': 'from-[hsl(var(--accent)/1.2)] to-[hsl(var(--secondary)/1.2)]',
    'from-green-50 to-emerald-50': 'from-[hsl(var(--accent)/0.05)] to-[hsl(var(--secondary)/0.05)]',
    'from-green-600/50 to-emerald-600/50': 'from-[hsl(var(--accent)/0.5)] to-[hsl(var(--secondary)/0.5)]',
    
    // Otros gradientes
    'from-orange-500 to-red-500': 'from-[hsl(var(--accent)/0.8)] to-[hsl(var(--primary)/0.8)]',
    'from-orange-50 to-red-50': 'from-[hsl(var(--accent)/0.05)] to-[hsl(var(--primary)/0.05)]',
    'from-gray-50 to-purple-50': 'from-[hsl(var(--background))] to-[hsl(var(--primary)/0.05)]',
    
    // Colores individuales - Purple a Primary
    'text-purple-600': 'text-[hsl(var(--primary))]',
    'text-purple-500': 'text-[hsl(var(--primary))]',
    'text-purple-700': 'text-[hsl(var(--primary)/1.2)]',
    'bg-purple-600': 'bg-[hsl(var(--primary))]',
    'bg-purple-500': 'bg-[hsl(var(--primary))]',
    'bg-purple-700': 'bg-[hsl(var(--primary)/1.2)]',
    'bg-purple-50': 'bg-[hsl(var(--primary)/0.05)]',
    'bg-purple-100': 'bg-[hsl(var(--primary)/0.1)]',
    'border-purple-600': 'border-[hsl(var(--primary))]',
    'border-purple-500': 'border-[hsl(var(--primary))]',
    'border-purple-300': 'border-[hsl(var(--primary)/0.3)]',
    'border-purple-100': 'border-[hsl(var(--primary)/0.1)]',
    
    // Colores individuales - Blue a Secondary
    'text-blue-600': 'text-[hsl(var(--secondary))]',
    'text-blue-500': 'text-[hsl(var(--secondary))]',
    'text-blue-700': 'text-[hsl(var(--secondary)/1.2)]',
    'bg-blue-600': 'bg-[hsl(var(--secondary))]',
    'bg-blue-500': 'bg-[hsl(var(--secondary))]',
    'bg-blue-700': 'bg-[hsl(var(--secondary)/1.2)]',
    'bg-blue-50': 'bg-[hsl(var(--secondary)/0.05)]',
    'bg-blue-100': 'bg-[hsl(var(--secondary)/0.1)]',
    'border-blue-600': 'border-[hsl(var(--secondary))]',
    'border-blue-500': 'border-[hsl(var(--secondary))]',
    'border-blue-300': 'border-[hsl(var(--secondary)/0.3)]',
    'border-blue-100': 'border-[hsl(var(--secondary)/0.1)]',
    
    // Colores individuales - Green a Accent
    'text-green-600': 'text-[hsl(var(--accent))]',
    'text-green-500': 'text-[hsl(var(--accent))]',
    'text-green-700': 'text-[hsl(var(--accent)/1.2)]',
    'bg-green-600': 'bg-[hsl(var(--accent))]',
    'bg-green-500': 'bg-[hsl(var(--accent))]',
    'bg-green-700': 'bg-[hsl(var(--accent)/1.2)]',
    'bg-green-50': 'bg-[hsl(var(--accent)/0.05)]',
    'bg-green-100': 'bg-[hsl(var(--accent)/0.1)]',
    'border-green-600': 'border-[hsl(var(--accent))]',
    'border-green-500': 'border-[hsl(var(--accent))]',
    'border-green-300': 'border-[hsl(var(--accent)/0.3)]',
    'border-green-100': 'border-[hsl(var(--accent)/0.1)]',
    
    // Hover states - Purple a Primary
    'hover:from-purple-700 hover:to-blue-700': 'hover:from-[hsl(var(--primary)/1.2)] hover:to-[hsl(var(--secondary)/1.2)]',
    'hover:from-green-600 hover:to-emerald-600': 'hover:from-[hsl(var(--accent)/1.2)] hover:to-[hsl(var(--secondary)/1.2)]',
    'hover:text-purple-600': 'hover:text-[hsl(var(--primary))]',
    'hover:text-purple-700': 'hover:text-[hsl(var(--primary)/1.2)]',
    'hover:bg-purple-600': 'hover:bg-[hsl(var(--primary))]',
    'hover:bg-purple-700': 'hover:bg-[hsl(var(--primary)/1.2)]',
    'hover:border-purple-600': 'hover:border-[hsl(var(--primary))]',
    'hover:border-purple-300': 'hover:border-[hsl(var(--primary)/0.3)]',
    
    // Hover states - Blue a Secondary
    'hover:text-blue-600': 'hover:text-[hsl(var(--secondary))]',
    'hover:text-blue-700': 'hover:text-[hsl(var(--secondary)/1.2)]',
    'hover:bg-blue-600': 'hover:bg-[hsl(var(--secondary))]',
    'hover:bg-blue-700': 'hover:bg-[hsl(var(--secondary)/1.2)]',
    'hover:border-blue-600': 'hover:border-[hsl(var(--secondary))]',
    'hover:border-blue-300': 'hover:border-[hsl(var(--secondary)/0.3)]',
    
    // Hover states - Green a Accent
    'hover:text-green-600': 'hover:text-[hsl(var(--accent))]',
    'hover:text-green-700': 'hover:text-[hsl(var(--accent)/1.2)]',
    'hover:bg-green-600': 'hover:bg-[hsl(var(--accent))]',
    'hover:bg-green-700': 'hover:bg-[hsl(var(--accent)/1.2)]',
    'hover:border-green-600': 'hover:border-[hsl(var(--accent))]',
    'hover:border-green-300': 'hover:border-[hsl(var(--accent)/0.3)]',
    
    // Colores de fondo animados
    'bg-purple-300': 'bg-[hsl(var(--primary)/0.3)]',
    'bg-blue-300': 'bg-[hsl(var(--secondary)/0.3)]',
    'bg-indigo-300': 'bg-[hsl(var(--accent)/0.3)]',
    
    // Colores de texto específicos
    'text-purple-200': 'text-[hsl(var(--primary)/0.2)]',
    'text-purple-300': 'text-[hsl(var(--primary)/0.3)]',
    'text-purple-400': 'text-[hsl(var(--primary)/0.4)]',
    
    // Colores de sombra
    'rgba(139, 92, 246, 0.15)': 'hsl(var(--primary) / 0.15)',
    'rgba(139, 92, 246, 0.1)': 'hsl(var(--primary) / 0.1)',
    'rgba(139, 92, 246, 0.2)': 'hsl(var(--primary) / 0.2)',
    'rgba(139, 92, 246, 0.3)': 'hsl(var(--primary) / 0.3)',
    'rgba(139, 92, 246, 0.4)': 'hsl(var(--primary) / 0.4)',
    
    // Colores de notificación
    'linear-gradient(to right, #10b981, #059669)': 'linear-gradient(to right, hsl(var(--accent)), hsl(var(--accent)/1.2))',
    'linear-gradient(to right, #3b82f6, #2563eb)': 'linear-gradient(to right, hsl(var(--secondary)), hsl(var(--secondary)/1.2))',
    'linear-gradient(to right, #6b7280, #4b5563)': 'linear-gradient(to right, hsl(var(--foreground)/0.5), hsl(var(--foreground)/0.7))'
};

// Función para actualizar un archivo
function updateFileColors(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let originalContent = content;
        let changes = 0;
        
        // Aplicar todas las sustituciones de colores
        for (const [oldColor, newColor] of Object.entries(colorMappings)) {
            const regex = new RegExp(oldColor.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
            const matches = content.match(regex);
            if (matches) {
                content = content.replace(regex, newColor);
                changes += matches.length;
            }
        }
        
        // Escribir el archivo si hubo cambios
        if (content !== originalContent) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(chalk.green(`✅ ${path.basename(filePath)}: ${changes} cambios aplicados`));
            return changes;
        } else {
            console.log(chalk.gray(`⏭️  ${path.basename(filePath)}: Sin cambios necesarios`));
            return 0;
        }
    } catch (error) {
        console.log(chalk.red(`❌ Error en ${path.basename(filePath)}: ${error.message}`));
        return 0;
    }
}

// Función para procesar directorio recursivamente
function processDirectory(dirPath) {
    const files = fs.readdirSync(dirPath);
    let totalChanges = 0;
    
    for (const file of files) {
        const filePath = path.join(dirPath, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
            totalChanges += processDirectory(filePath);
        } else if (file.endsWith('.hbs')) {
            totalChanges += updateFileColors(filePath);
        }
    }
    
    return totalChanges;
}

// Directorios a procesar
const directories = [
    'src/views/partials/sections',
    'src/views/layouts',
    'src/views/partials/components',
    'src/views/partials/styles'
];

let totalChanges = 0;

console.log(chalk.yellow('📁 Procesando directorios...\n'));

for (const dir of directories) {
    if (fs.existsSync(dir)) {
        console.log(chalk.blue(`📂 Procesando: ${dir}`));
        totalChanges += processDirectory(dir);
        console.log('');
    } else {
        console.log(chalk.red(`❌ Directorio no encontrado: ${dir}`));
    }
}

console.log(chalk.blue.bold('\n📊 RESUMEN DE ACTUALIZACIONES'));
console.log(chalk.gray('================================\n'));

console.log(chalk.green(`✅ Total de cambios aplicados: ${totalChanges}`));
console.log(chalk.cyan(`🎨 Colores actualizados a variables CSS dinámicas`));
console.log(chalk.yellow(`🔧 Los colores ahora se adaptan automáticamente al tema del cliente`));

console.log(chalk.blue.bold('\n🎯 MAPPING DE COLORES IMPLEMENTADO:'));
console.log(chalk.gray('=====================================\n'));

console.log(chalk.cyan('🟣 Purple/Blue → Primary/Secondary (colores principales)'));
console.log(chalk.cyan('🟢 Green/Emerald → Accent/Secondary (colores de acento)'));
console.log(chalk.cyan('🟠 Orange/Red → Accent/Primary (colores de alerta)'));
console.log(chalk.cyan('⚪ Gray → Background/Foreground (colores neutros)'));

console.log(chalk.blue.bold('\n🎨 TEMAS DISPONIBLES:'));
console.log(chalk.gray('===================\n'));

console.log(chalk.magenta('• Clásico: Rosa/Magenta y Verde (ideal para flores)'));
console.log(chalk.gray('• Moderno: Grises elegantes (minimalista)'));
console.log(chalk.black('• Minimalista: Blanco y negro (corporativo)'));
console.log(chalk.cyan('• Colorido: Colores vibrantes (creativo)'));

console.log(chalk.blue.bold('\n🚀 PRÓXIMOS PASOS:'));
console.log(chalk.gray('==================\n'));

console.log(chalk.cyan('1. Reiniciar el servicio en Render'));
console.log(chalk.cyan('2. Probar las páginas con diferentes temas'));
console.log(chalk.cyan('3. Verificar que los colores cambien según la configuración del cliente'));
console.log(chalk.cyan('4. Cada cliente tendrá su propia paleta de colores personalizada'));

console.log(chalk.green.bold('\n🎉 ¡ACTUALIZACIÓN COMPLETADA!'));
console.log(chalk.yellow('   Todos los colores ahora son dinámicos y se adaptan al tema del cliente'));
console.log(chalk.cyan('   Cada sección usará automáticamente los colores configurados por el cliente'));
