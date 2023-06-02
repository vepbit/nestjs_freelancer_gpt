import { UseFilters } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEmpty, IsNotEmpty, Length, MinLength } from "class-validator";


export class GetProjectsDTO {

    @ApiProperty({
        default: 1,
    })
    propose_status: string;
}