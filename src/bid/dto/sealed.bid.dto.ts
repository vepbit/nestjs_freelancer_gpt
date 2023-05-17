import { UseFilters } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEmpty, IsNotEmpty, Length, MinLength } from "class-validator";


export class SealBidDTO{

    @ApiProperty({
        default: "seal",
    })
    action: string;

    @ApiProperty({
        default: 383282650,
    })
    bid_id: number;
}