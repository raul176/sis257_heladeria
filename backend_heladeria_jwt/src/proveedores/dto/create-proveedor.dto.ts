import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';

export class CreateProveedorDto {
  @ApiProperty({
    example: 'Helados La Estrella',
  })
  @IsNotEmpty({ message: 'El campo razonSocial no debe ser vacío' })
  @IsString({ message: 'El campo razonSocial debe ser de tipo cadena' })
  @MaxLength(50, { message: 'El campo razonSocial no debe ser mayor a 50 caracteres' })
  razonSocial: string;

  @ApiProperty({
    example: '123456789',
  })
  @IsNotEmpty({ message: 'El campo nit no debe ser vacío' })
  @IsString({ message: 'El campo nit debe ser de tipo cadena' })
  @MaxLength(20, { message: 'El campo nit no debe ser mayor a 20 caracteres' })
  nit: string;

  @ApiProperty({
    example: '+591 71234567',
  })
  @IsNotEmpty({ message: 'El campo telefono no debe ser vacío' })
  @IsString({ message: 'El campo telefono debe ser de tipo cadena' })
  @MaxLength(50, { message: 'El campo telefono no debe ser mayor a 50 caracteres' })
  @Matches(/^[0-9+\-\s()]+$/, { message: 'El campo telefono tiene un formato inválido' })
  telefono: string;

  @ApiProperty({
    example: 'Lácteos',
  })
  @IsNotEmpty({ message: 'El campo tipoProveedor no debe ser vacío' })
  @IsString({ message: 'El campo tipoProveedor debe ser de tipo cadena' })
  @MaxLength(100, { message: 'El campo tipoProveedor no debe ser mayor a 100 caracteres' })
  tipoProducto: string;
}
