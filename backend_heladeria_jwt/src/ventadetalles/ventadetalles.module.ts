import { Module } from '@nestjs/common';
import { VentadetallesService } from './ventadetalles.service';
import { VentadetallesController } from './ventadetalles.controller';
import { Ventadetalle } from './entities/ventadetalle.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Ventadetalle])],
  controllers: [VentadetallesController],
  providers: [VentadetallesService],
})
export class VentadetallesModule {}
