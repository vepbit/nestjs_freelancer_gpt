import { UseFilters } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEmpty, IsNotEmpty, Length, MinLength } from "class-validator";


export class FindProjectByIdDTO{

    @ApiProperty({
        default: 36547512,
    })
    project_id: number;

    @ApiProperty({
        default: "some desc",
    })
    description: string;

    @ApiProperty({
        default: 'test',
    })
    bidstatus: string;
}