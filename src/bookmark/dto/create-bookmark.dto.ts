import { IsEmpty, IsOptional, IsString } from "class-validator"

export class CreateBookmarkDto{

    @IsString()
    @IsEmpty()
    title:string
    @IsString()
    @IsOptional()
    description:string
    @IsString()
    @IsEmpty()
    link:string
}