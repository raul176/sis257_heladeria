import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ProductosModule } from './productos/productos.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SaboresModule } from './sabores/sabores.module';
import { EmpleadosModule } from './empleados/empleados.module';
import { VentasModule } from './ventas/ventas.module';
import { ProveedoresModule } from './proveedores/proveedores.module';

@Module({
  imports: [ConfigModule.forRoot(), 
    TypeOrmModule.forRoot({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [__dirname + '*/**/entities/*.{ts|js}'],
    synchronize: true,
    autoLoadEntities: true,
  }),
  ProductosModule,
  SaboresModule,
  EmpleadosModule,
  VentasModule,
  ProveedoresModule
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
