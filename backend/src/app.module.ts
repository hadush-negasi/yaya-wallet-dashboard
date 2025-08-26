import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { TransactionsModule } from './transactions/transactions.module';
import { TimeOffsetService } from './common/time-offset.service';
import { AppController } from './app.controller';
import { TransactionsController } from './transactions/transactions.controller';
import { AppService } from './app.service';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    HttpModule,
    TransactionsModule,
  ],
  controllers: [TransactionsController, AppController],
  providers: [TimeOffsetService, AppService],
})
export class AppModule {}