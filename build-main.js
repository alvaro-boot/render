const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔄 Compilando proyecto...');

try {
  // Compilar el proyecto completo
  execSync('npx nest build', { stdio: 'inherit' });
  
  console.log('✅ Compilación completada');
  
  // Verificar que main.js existe
  const mainJsPath = path.join(__dirname, 'dist', 'main.js');
  if (!fs.existsSync(mainJsPath)) {
    throw new Error('No se encontró main.js en la carpeta dist');
  }
  
  // Crear carpeta temporal
  const tempDir = path.join(__dirname, 'temp-dist');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
  }
  
  // Función para copiar archivos y carpetas recursivamente
  function copyFilesAndFolders(src, dest) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    
    const items = fs.readdirSync(src);
    
    items.forEach(item => {
      const srcPath = path.join(src, item);
      const destPath = path.join(dest, item);
      const stat = fs.statSync(srcPath);
      
      if (stat.isDirectory()) {
        // Copiar carpeta completa
        copyFilesAndFolders(srcPath, destPath);
        console.log(`📁 Copiada carpeta: ${item}`);
      } else if (item.endsWith('.js')) {
        // Copiar solo archivos .js
        fs.copyFileSync(srcPath, destPath);
        console.log(`📄 Copiado archivo: ${item}`);
      }
      // Ignorar otros tipos de archivos (.d.ts, .js.map, etc.)
    });
  }
  
  // Copiar archivos .js y carpetas necesarias
  copyFilesAndFolders(path.join(__dirname, 'dist'), tempDir);
  
  // Eliminar carpeta dist original
  fs.rmSync(path.join(__dirname, 'dist'), { recursive: true, force: true });
  
  // Crear nueva carpeta dist
  fs.mkdirSync(path.join(__dirname, 'dist'));
  
  // Mover todo de vuelta a dist
  copyFilesAndFolders(tempDir, path.join(__dirname, 'dist'));
  
  // Eliminar carpeta temporal
  fs.rmSync(tempDir, { recursive: true, force: true });
  
  console.log('✅ Archivos .js y carpetas necesarias han sido generados en la carpeta dist');
  console.log('📁 Estructura generada:');
  
  function printStructure(dir, prefix = '') {
    const items = fs.readdirSync(dir);
    items.forEach(item => {
      const itemPath = path.join(dir, item);
      const stat = fs.statSync(itemPath);
      if (stat.isDirectory()) {
        console.log(`${prefix}📁 ${item}/`);
        printStructure(itemPath, prefix + '  ');
      } else {
        console.log(`${prefix}📄 ${item}`);
      }
    });
  }
  
  printStructure(path.join(__dirname, 'dist'));
  
} catch (error) {
  console.error('❌ Error durante la compilación:', error.message);
  process.exit(1);
}
