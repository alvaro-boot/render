const chalk = require('chalk');

console.log(chalk.blue.bold('🔧 TESTING HANDLEBARS HELPERS'));
console.log(chalk.gray('================================\n'));

// Simular el entorno de Handlebars
const Handlebars = require('handlebars');

// Registrar todos los helpers que deberían estar disponibles
function registerAllHelpers() {
    console.log(chalk.yellow('📝 Registrando helpers...'));

    // Helper para comparación de igualdad
    Handlebars.registerHelper('eq', function(a, b) {
        return a === b;
    });

    // Helper para restar números
    Handlebars.registerHelper('subtract', function(a, b) {
        return a - b;
    });

    // Helper para convertir a JSON
    Handlebars.registerHelper('json', function(obj) {
        return JSON.stringify(obj);
    });

    // Helper para iterar n veces
    Handlebars.registerHelper('times', function(n, options) {
        let accum = '';
        for (let i = 0; i < n; i++) {
            options.data.index = i;
            accum += options.fn(i);
        }
        return accum;
    });

    // Helper para formatear precios
    Handlebars.registerHelper('formatPrice', function(price) {
        if (typeof price === 'number') {
            return `$${price.toFixed(2)}`;
        }
        return price;
    });

    // Helper para URLs seguras
    Handlebars.registerHelper('safeUrl', function(url) {
        if (!url) return '#';
        return url.startsWith('http') ? url : `https://${url}`;
    });

    // Helper para iterar con índice
    Handlebars.registerHelper('eachWithIndex', function(array, options) {
        let result = '';
        for (let i = 0; i < array.length; i++) {
            options.data.index = i;
            result += options.fn(array[i]);
        }
        return result;
    });

    // Helper para comparación condicional
    Handlebars.registerHelper('ifEquals', function(arg1, arg2, options) {
        return (arg1 === arg2) ? options.fn(this) : options.inverse(this);
    });

    // Helper para truncar texto
    Handlebars.registerHelper('truncate', function(str, length) {
        if (str.length <= length) return str;
        return str.substring(0, length) + '...';
    });

    // Helper para sumar números
    Handlebars.registerHelper('add', function(a, b) {
        return a + b;
    });

    // Helper para multiplicar números
    Handlebars.registerHelper('multiply', function(a, b) {
        return a * b;
    });

    // Helper para obtener el nombre de visualización de una sección
    Handlebars.registerHelper('getSectionDisplayName', function(sectionId) {
        const displayNames = {
            hero: "Inicio",
            about: "Nosotros",
            products: "Productos",
            services: "Servicios",
            testimonials: "Testimonios",
            gallery: "Galería",
            contact: "Contacto",
            cart: "Carrito",
            appointments: "Citas",
            stats: "Estadísticas"
        };
        return displayNames[sectionId] || sectionId;
    });

    console.log(chalk.green('✅ Todos los helpers registrados'));
}

// Función para probar helpers
function testHelpers() {
    console.log(chalk.blue('\n🧪 Probando helpers...\n'));

    const testCases = [
        {
            name: 'eq (igualdad)',
            template: '{{#if (eq a b)}}Igual{{else}}Diferente{{/if}}',
            data: { a: 5, b: 5 },
            expected: 'Igual'
        },
        {
            name: 'subtract (resta)',
            template: '{{subtract 10 3}}',
            data: {},
            expected: '7'
        },
        {
            name: 'add (suma)',
            template: '{{add 5 3}}',
            data: {},
            expected: '8'
        },
        {
            name: 'multiply (multiplicación)',
            template: '{{multiply 4 6}}',
            data: {},
            expected: '24'
        },
        {
            name: 'times (iteración)',
            template: '{{#times 3}}{{@index}}{{/times}}',
            data: {},
            expected: '012'
        },
        {
            name: 'times con multiply',
            template: '{{#times 3}}{{multiply @index 2}}{{/times}}',
            data: {},
            expected: '024'
        },
        {
            name: 'subtract con times',
            template: '{{#times (subtract 5 2)}}{{@index}}{{/times}}',
            data: {},
            expected: '012'
        },
        {
            name: 'getSectionDisplayName',
            template: '{{getSectionDisplayName "hero"}}',
            data: {},
            expected: 'Inicio'
        },
        {
            name: 'formatPrice',
            template: '{{formatPrice 19.99}}',
            data: {},
            expected: '$19.99'
        },
        {
            name: 'truncate',
            template: '{{truncate "Texto muy largo" 10}}',
            data: {},
            expected: 'Texto muy...'
        }
    ];

    let passed = 0;
    let failed = 0;

    testCases.forEach(testCase => {
        try {
            const template = Handlebars.compile(testCase.template);
            const result = template(testCase.data);
            
            if (result === testCase.expected) {
                console.log(chalk.green(`✅ ${testCase.name}: ${result}`));
                passed++;
            } else {
                console.log(chalk.red(`❌ ${testCase.name}: Esperado "${testCase.expected}", Obtenido "${result}"`));
                failed++;
            }
        } catch (error) {
            console.log(chalk.red(`❌ ${testCase.name}: Error - ${error.message}`));
            failed++;
        }
    });

    return { passed, failed };
}

// Función para probar templates complejos
function testComplexTemplates() {
    console.log(chalk.blue('\n🎨 Probando templates complejos...\n'));

    const complexTemplates = [
        {
            name: 'Template con partículas',
            template: `
                {{#times 5}}
                <div class="particle" style="left: {{multiply @index 20}}%; animation-delay: {{multiply @index 0.2}}s;"></div>
                {{/times}}
            `,
            data: {},
            expected: 'particle'
        },
        {
            name: 'Template con calificación de estrellas',
            template: `
                {{#times rating}}
                <i class="fas fa-star"></i>
                {{/times}}
                {{#times (subtract 5 rating)}}
                <i class="fas fa-star-o"></i>
                {{/times}}
            `,
            data: { rating: 3 },
            expected: 'fas fa-star'
        },
        {
            name: 'Template con sección de navegación',
            template: `
                {{#each sections}}
                <a href="/section/{{id}}">{{getSectionDisplayName id}}</a>
                {{/each}}
            `,
            data: { 
                sections: [
                    { id: 'hero' },
                    { id: 'about' },
                    { id: 'contact' }
                ]
            },
            expected: 'Inicio'
        }
    ];

    let passed = 0;
    let failed = 0;

    complexTemplates.forEach(testCase => {
        try {
            const template = Handlebars.compile(testCase.template);
            const result = template(testCase.data);
            
            if (result.includes(testCase.expected)) {
                console.log(chalk.green(`✅ ${testCase.name}: Funciona correctamente`));
                passed++;
            } else {
                console.log(chalk.red(`❌ ${testCase.name}: No contiene el elemento esperado`));
                failed++;
            }
        } catch (error) {
            console.log(chalk.red(`❌ ${testCase.name}: Error - ${error.message}`));
            failed++;
        }
    });

    return { passed, failed };
}

// Ejecutar pruebas
try {
    registerAllHelpers();
    
    const basicResults = testHelpers();
    const complexResults = testComplexTemplates();
    
    const totalPassed = basicResults.passed + complexResults.passed;
    const totalFailed = basicResults.failed + complexResults.failed;
    const totalTests = totalPassed + totalFailed;
    
    console.log(chalk.blue.bold('\n📊 RESUMEN DE PRUEBAS'));
    console.log(chalk.gray('=====================\n'));
    
    console.log(chalk.green(`✅ Pruebas exitosas: ${totalPassed}`));
    console.log(chalk.red(`❌ Pruebas fallidas: ${totalFailed}`));
    console.log(chalk.blue(`📈 Total de pruebas: ${totalTests}`));
    
    const successRate = Math.round((totalPassed / totalTests) * 100);
    console.log(chalk.yellow(`🎯 Tasa de éxito: ${successRate}%`));
    
    if (totalFailed === 0) {
        console.log(chalk.green.bold('\n🎉 ¡TODOS LOS HELPERS FUNCIONAN CORRECTAMENTE!'));
        console.log(chalk.cyan('   El sistema está listo para renderizar templates'));
    } else {
        console.log(chalk.red.bold('\n⚠️  HAY PROBLEMAS CON ALGUNOS HELPERS'));
        console.log(chalk.yellow('   Revisa los errores arriba'));
    }
    
} catch (error) {
    console.log(chalk.red.bold('\n💥 ERROR CRÍTICO:'));
    console.log(chalk.red(error.message));
    process.exit(1);
}
