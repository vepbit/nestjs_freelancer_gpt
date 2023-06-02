import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEmpty, IsNotEmpty, Length, MinLength } from "class-validator";


export class FindProjectByIdAndDisableDTO {

    @ApiProperty({
        default: 36559973,
    })
    project_id: number;

    @ApiProperty({
        default: "",
    })
    @IsEmpty()
    description: string;

    @ApiProperty({
        default: '',
    })
    @IsEmpty()
    bidstatus: string;
}