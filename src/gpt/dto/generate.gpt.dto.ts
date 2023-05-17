import { UseFilters } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEmpty, IsNotEmpty, Length, MinLength } from "class-validator";


export class GenerateGptDTO{

    @ApiProperty({
        default: "I'm software developer with 10 years.",
    })
    readonly bio: string;

    @ApiProperty({
        default: 'I want wordpress website.',
    })
    @IsNotEmpty()
    readonly title: string;

}