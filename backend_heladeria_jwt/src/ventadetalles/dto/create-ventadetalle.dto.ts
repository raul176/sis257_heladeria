import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDefined, IsInt, IsNotEmpty, IsNumber, Min } from "class-validator";
import { Producto } from "src/productos/entities/producto.entity";
import { Venta } from "src/ventas/entities/venta.entity";

export class CreateVentadetalleDto {
      @ApiProperty()
      @Type(() => Number)
      @IsDefined({ message: 'El campo idVenta debe estar definido' })
      @IsInt({ message: 'El campo idVenta debe ser de tipo numérico' })
      readonly idVenta: Venta['id'];
      
      @ApiProperty()
      @Type(() => Number)
      @IsDefined({ message: 'El campo idProducto debe estar definido' })
      @IsInt({ message: 'El campo idProducto debe ser de tipo numérico' })
      readonly idProducto: Producto['id'];
    
      @ApiProperty()
      @IsNotEmpty({ message: 'El campo monto total no debe ser vacío' })
      @IsNumber({}, { message: 'El campo monto total debe ser de tipo numérico' })
      @Min(0, { message: 'El campo monto total debe ser mayor o igual a 0' })
      cantidad: number;
    
      @ApiProperty()
      @IsNotEmpty({ message: 'El campo monto pagado no debe ser vacío' })
      @IsNumber({}, { message: 'El campo monto pagado debe ser de tipo numérico' })
      @Min(0, { message: 'El campo monto pagado debe ser mayor o igual a 0' })
      precioUnitario: number;
}
