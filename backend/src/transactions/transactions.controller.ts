import { Controller, Get, Post, Query, Body, ParseIntPipe } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { SearchDto } from './dto/search.dto';

@Controller('transactions')
export class TransactionsController {
    constructor(private readonly svc: TransactionsService) {}

    @Get()
    async list(@Query('p') p?: number) {
        const pageNumber = p || 1;
        const data = await this.svc.getByUser(pageNumber);
        return { page: pageNumber, ...data };
    }


    @Post('search')
    async search(@Body() dto: SearchDto, @Query('p') p?: number) {
        const pageNumber = p || 1;
        const data = await this.svc.search(dto.query, pageNumber);
        return { page: pageNumber, ...data };
    }


    @Get('me')
    me() {
        return { accountName: this.svc.getCurrentAccountName() };
    }
}