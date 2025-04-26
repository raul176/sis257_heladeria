import { PartialType } from '@nestjs/mapped-types';
import { CreateVentadetalleDto } from './create-ventadetalle.dto';

export class UpdateVentadetalleDto extends PartialType(CreateVentadetalleDto) {}
