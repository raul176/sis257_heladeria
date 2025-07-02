import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDefined, IsInt, IsNotEmpty, IsNumber, IsString, MaxLength, Min } from 'class-validator';
import { Proveedor } from 'src/proveedores/entities/proveedor.entity';
import { Sabor } from 'src/sabores/entities/sabor.entity';

export class CreateProductoDto {
  @ApiProperty({
    example: 1,
    description: 'ID del sabor asociado al producto',
  })
  @Type(() => Number)
  @IsDefined({ message: 'El campo idSabor debe estar definido' })
  @IsInt({ message: 'El campo idSabor debe ser de tipo numérico' })
  readonly idSabor: Sabor['id'];

  @ApiProperty({
    example: 2,
    description: 'ID del proveedor asociado al producto',
  })
  @Type(() => Number)
  @IsDefined({ message: 'El campo idProveedor debe estar definido' })
  @IsInt({ message: 'El campo idProveedor debe ser de tipo numérico' })
  readonly idProveedor: Proveedor['id'];

  @ApiProperty({
    example: 'Helado de Chocolate',
    description: 'Nombre del producto',
  })
  @IsNotEmpty({ message: 'El campo nombre no debe ser vacío' })
  @IsString({ message: 'El campo nombre debe ser de tipo cadena' })
  @MaxLength(100, { message: 'El campo nombre no debe ser mayor a 100 caracteres' })
  nombre: string;

  @ApiProperty({
    example: '1 litro',
    description: 'Presentación del producto',
  })
  @IsNotEmpty({ message: 'El campo presentación no debe ser vacío' })
  @IsString({ message: 'El campo presentación debe ser de tipo cadena' })
  @MaxLength(255, { message: 'El campo presentación no debe ser mayor a 255 caracteres' })
  presentacion: string;

  @ApiProperty({
    example: 25.5,
    description: 'Precio del producto (máximo 2 decimales)',
  })
  @IsNotEmpty({ message: 'El campo precio no debe ser vacío' })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'El campo precio debe ser de tipo numérico y tener como máximo 2 decimales' },
  )
  @Min(0, { message: 'El campo precio debe ser mayor o igual a 0' })
  precio: number;

  @ApiProperty({
    example: 100,
    description: 'Cantidad de producto en stock',
  })
  @IsNotEmpty({ message: 'El campo stock no debe ser vacío' })
  @IsInt({ message: 'El campo stock debe ser de tipo numérico' })
  @Min(0, { message: 'El campo stock debe ser mayor o igual a 0' })
  stock: number;
}
