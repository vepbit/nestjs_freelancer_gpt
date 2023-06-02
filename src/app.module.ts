import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GptModule } from './gpt/gpt.module';
import { BidModule } from './bid/bid.module';
import { Test } from './entities/test.entity';
import { Dialogflow } from './entities/dialogflow.entity';
import { List } from './entities/list.entity';
import { Bids } from './entities/bids.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { ProjectModule } from './project/project.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot(),
    GptModule,
    BidModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQL_HOST,
      port: 3306,
      username: process.env.MYSQL_USERNAME,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      entities: [Test, Dialogflow, List, Bids],
      synchronize: false,
    }),
    ProjectModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
