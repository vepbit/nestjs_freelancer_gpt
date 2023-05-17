import { UseFilters } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEmpty, IsNotEmpty, Length, MinLength } from "class-validator";


export class CreateBidDTO{

    @ApiProperty({
        default: 123214215,
    })
    project_id: number;

    @ApiProperty({
        default: 14590172,
    })
    @IsNotEmpty()
    readonly bidder_id: number;

    @ApiProperty({
        default: 0,
    })
    amount: number;

    @ApiProperty({
        default: 14,
    })
    period: number;

    @ApiProperty({
        default: 50,
    })
    milestone_percentage: number;

    @ApiProperty({
        default: true,
    })
    sealed: boolean;


    @ApiProperty({
        default: "forst payment",
    })
    description: string;
}