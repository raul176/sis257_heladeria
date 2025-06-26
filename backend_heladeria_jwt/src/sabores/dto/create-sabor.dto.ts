import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateSaborDto {
    @ApiProperty({
        example: 'Chocolate',
        description: 'Nombre del sabor',
        maxLength: 100,
    })
    @IsNotEmpty({ message: 'El campo nombre no debe ser vacío' })
    @IsString({ message: 'El campo nombre debe ser de tipo cadena' })
    @MaxLength(100, { message: 'El campo nombre no debe ser mayor a 100 caracteres' }) 
    readonly nombre: string;

    @ApiProperty({
        example: 'Sabor a chocolate con trozos de chocolate',
        description: 'Descripción del sabor',
        maxLength: 255,
    })
    @IsString({ message: 'El campo descripcion debe ser de tipo cadena' })
    @MaxLength(255, { message: 'El campo descripcion no debe ser mayor a 255 caracteres' })
    readonly descripcion: string;
}