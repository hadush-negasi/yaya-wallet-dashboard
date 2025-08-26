import { IsString, Length } from 'class-validator';


export class SearchDto {
    @IsString()   // search query should be string
    @Length(1, 100) // limit the length of search query to 100 characters
    query!: string;
}