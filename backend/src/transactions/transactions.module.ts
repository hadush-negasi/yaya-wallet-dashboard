import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { TimeOffsetService } from 'src/common/time-offset.service';


@Module({
imports: [HttpModule],
controllers: [TransactionsController],
providers: [TransactionsService, TimeOffsetService],
exports: [TransactionsService]
})
export class TransactionsModule {}