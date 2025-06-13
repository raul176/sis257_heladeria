import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDefined, IsInt, IsNotEmpty, IsNumber, IsString, MaxLength, Min } from "class-validator";
import { Cliente } from "src/clientes/entities/cliente.entity";
import { Usuario } from "src/usuarios/entities/usuario.entity";

export class CreateVentaDto {
  @ApiProperty()
  @Type(() => Number)
  @IsDefined({ message: 'El campo idUsuario debe estar definido' })
  @IsInt({ message: 'El campo idUsuario debe ser de tipo numérico' })
  readonly idUsuario: Usuario['id'];
  
  @ApiProperty()
  @Type(() => Number)
  @IsDefined({ message: 'El campo idUsuario debe estar definido' })
  @IsInt({ message: 'El campo idUuario debe ser de tipo numérico' })
  readonly idCliente: Cliente['id'];
  
  @ApiProperty()
  @IsNotEmpty({ message: 'El campo tipo pago no debe ser vacío' })
  @IsString({ message: 'El campo tipo pago debe ser de tipo cadena' })
  @MaxLength(50, { message: 'El campo tipo pago no debe ser mayor a 50 caracteres' })
  tipoPago: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'El campo monto total no debe ser vacío' })
  @IsNumber({}, { message: 'El campo monto total debe ser de tipo numérico' })
  @Min(0, { message: 'El campo monto total debe ser mayor o igual a 0' })
  montoTotal: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'El campo monto pagado no debe ser vacío' })
  @IsNumber({}, { message: 'El campo monto pagado debe ser de tipo numérico' })
  @Min(0, { message: 'El campo monto pagado debe ser mayor o igual a 0' })
  montoPagado: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'El campo cambio no debe ser vacío' })
  @IsNumber({}, { message: 'El campo cambio debe ser de tipo numérico' })
  @Min(0, { message: 'El campo cambio debe ser mayor o igual a 0' })
  cambio: number;
}
