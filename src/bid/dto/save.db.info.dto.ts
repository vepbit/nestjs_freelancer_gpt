import { UseFilters } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEmpty, IsNotEmpty, Length, MinLength } from "class-validator";


export class SaveDbInfoDTO{

    @ApiProperty({
        default: 123214215,
    })
    project_id: number;

    @ApiProperty({
        default: 32432432432432,
    })
    time_submitted: number;

    @ApiProperty({
        default: 50,
    })
    milestone_percentage: number;

    @ApiProperty({
        default: 14,
    })
    period: number;

    @ApiProperty({
        default: 300,
    })
    amount: number;


    @ApiProperty({
        default: "some desc",
    })
    description: string;

    @ApiProperty({
        default: 'success',
    })
    status: string;
}