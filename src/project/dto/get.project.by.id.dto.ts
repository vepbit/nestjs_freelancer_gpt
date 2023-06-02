import { UseFilters } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEmpty, IsNotEmpty, Length, MinLength } from "class-validator";


export class GetProjectByIdDTO {

    @ApiProperty({
        default: 36559973,
    })
    project_id: number;
}