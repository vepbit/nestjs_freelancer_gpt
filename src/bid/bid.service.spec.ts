import { Test, TestingModule } from '@nestjs/testing';
import { BidService } from './bid.service';
import { HttpModule } from '@nestjs/axios';
import { TypeORMMySqlTestingModule } from '../test-utils/TypeORMMySqlTestingModule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { List } from './../entities/list.entity';
import { Bids } from './../entities/bids.entity';
import { ProjectModule } from './../project/project.module';

describe('BidService', () => {
  let service: BidService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BidService],
      imports: [
        HttpModule,
        ProjectModule,
        TypeORMMySqlTestingModule([List, Bids]),
        TypeOrmModule.forFeature([List, Bids]),
      ],
    }).compile();

    service = module.get<BidService>(BidService);
    // console.log('loloooo')
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });


});
