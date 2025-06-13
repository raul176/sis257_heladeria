import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDefined, IsInt, IsNotEmpty, IsNumber, IsString, MaxLength, Min } from 'class-validator';
import { Proveedor } from 'src/proveedores/entities/proveedor.entity';
import { Sabor } from 'src/sabores/entities/sabor.entity';

export class CreateProductoDto {
  @ApiProperty()
  @Type(() => Number)
  @IsDefined({ message: 'El campo idSabor debe estar definido' })
  @IsInt({ message: 'El campo idSabor debe ser de tipo numérico' })
  readonly idSabor: Sabor['id'];

  @ApiProperty()
  @Type(() => Number)
  @IsDefined({ message: 'El campo idProveedor debe estar definido' })
  @IsInt({ message: 'El campo idProveedor debe ser de tipo numérico' })
  readonly idProveedor: Proveedor['id'];

  @ApiProperty()
  @IsNotEmpty({ message: 'El campo nombre no debe ser vacío' })
  @IsString({ message: 'El campo nombre debe ser de tipo cadena' })
  @MaxLength(100, { message: 'El campo nombre no debe ser mayor a 100 caracteres' })
  nombre: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'El campo presentación no debe ser vacío' })
  @IsString({ message: 'El campo presentación debe ser de tipo cadena' })
  @MaxLength(255, { message: 'El campo presentación no debe ser mayor a 255 caracteres' })
  presentacion: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'El campo precio no debe ser vacío' })
  @IsNumber({}, { message: 'El campo precio debe ser de tipo numérico' })
  @Min(0, { message: 'El campo precio debe ser mayor o igual a 0' })
  precio: number;
}
