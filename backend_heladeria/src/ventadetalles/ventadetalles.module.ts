import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ventadetalle } from './entities/ventadetalle.entity';
import { VentadetallesController } from './ventadetalles.controller';
import { VentadetallesService } from './ventadetalles.service';

@Module({
  imports: [TypeOrmModule.forFeature([Ventadetalle])],
  controllers: [VentadetallesController],
  providers: [VentadetallesService],
})
export class VentadetallesModule {}
