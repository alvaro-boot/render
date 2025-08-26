import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './shared/filters/http-exception.filter';
import { AddressInfo } from 'net';
import * as express from 'express';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const configService = app.get(ConfigService);
  const defaultPort = configService.get<number>('port', 3001);

  // Global pipes
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Global filters
  app.useGlobalFilters(new HttpExceptionFilter());

  // CORS
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Global prefix
  app.setGlobalPrefix('api/v1');

  // Middleware para servir archivos estáticos
  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
  app.use('/static', express.static(path.join(process.cwd(), 'src/views')));

  // Middleware para mejorar el renderizado
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Middleware para logging de requests
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
  });

  // Buscar puerto disponible
  const port = await findAvailablePort(defaultPort);
  
  await app.listen(port);
  console.log(`🚀 Template Renderer Service running on port ${port}`);
  console.log(`📁 Static files served from: ${path.join(process.cwd(), 'uploads')}`);
  console.log(`🎨 Templates available at: http://localhost:${port}/api/v1/client-templates`);
}

async function findAvailablePort(startPort: number): Promise<number> {
  const net = require('net');
  
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    
    server.listen(startPort, () => {
      const address = server.address() as AddressInfo;
      const port = address.port;
      server.close(() => {
        resolve(port);
      });
    });
    
    server.on('error', (err: any) => {
      if (err.code === 'EADDRINUSE') {
        // Puerto ocupado, intentar con el siguiente
        findAvailablePort(startPort + 1)
          .then(resolve)
          .catch(reject);
      } else {
        reject(err);
      }
    });
  });
}

bootstrap();