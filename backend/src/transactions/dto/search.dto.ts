import { IsString, Length } from 'class-validator';


export class SearchDto {
    @IsString()
    @Length(1, 100)
    query!: string;
}