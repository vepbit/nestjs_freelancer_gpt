import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BidService } from './bid.service';
import { BidController } from './bid.controller';

import { HttpModule } from '@nestjs/axios';
import { Dialogflow } from 'src/entities/dialogflow.entity';
import { List } from 'src/entities/list.entity';
import { Bids } from 'src/entities/bids.entity';
import { ProjectModule } from 'src/project/project.module';

@Module({
  imports: [
    ProjectModule,
    HttpModule.register({
      timeout: 120000,
      maxRedirects: 3,
    }),
    TypeOrmModule.forFeature([Dialogflow, List, Bids]),
  ],
  providers: [BidService],
  controllers: [BidController]
})
export class BidModule { }
