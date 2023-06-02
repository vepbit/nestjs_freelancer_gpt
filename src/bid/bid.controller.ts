import { Body, Controller, Post, Put, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { BidService } from './bid.service';
import { CreateBidDTO } from './dto/create.bid.dto';
import { SealBidDTO } from './dto/sealed.bid.dto';
import { SaveDbInfoDTO } from './dto/save.db.info.dto';
import { FindProjectByIdAndDisableDTO } from './dto/find.project.by.id.and.disable.dto';


@ApiTags('bid')
@Controller('bid')
export class BidController {
    constructor(
        private bidService: BidService,
    ) { }


    @Post('create')
    @ApiOperation({ description: "Create bid" })
    async createBid(@Body() createBidDTO: CreateBidDTO) {
        let createBid = this.bidService.publisBid(createBidDTO);

        return createBid;
    }

    @Put('sealed')
    @ApiOperation({ description: "Sealed bid" })
    async sealedBid(@Body() sealBidDTO: SealBidDTO) {
        let sealeBid = this.bidService.sealedBid(sealBidDTO);
        return sealeBid;
    }

    @Post('bidsave')
    @ApiOperation({ description: "Save project bid" })
    async bidSave(@Body() saveDbInfoDTO: SaveDbInfoDTO) {
        let bidToSave = this.bidService.saveBidInfo(saveDbInfoDTO);
        return bidToSave;
    }

    saveBidInfro
}
