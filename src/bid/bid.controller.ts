import { Body, Controller, Post, Put, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { BidService } from './bid.service';
import { CreateBidDTO } from './dto/create.bid.dto';
import { SealBidDTO } from './dto/sealed.bid.dto';
import { FindProjectByIdDTO } from './dto/find.project.by.id.dto';
import { SaveDbInfoDTO } from './dto/save.db.info.dto';


@ApiTags('bid')
@Controller('bid')
export class BidController {
    constructor(
        private bidService: BidService,
    ) {}


    @Post('create')
    @ApiOperation({ description: "Create bid" })
    async createBid(@Body() createBidDTO:CreateBidDTO){
        let createBid = this.bidService.publishPropose(createBidDTO);

        return createBid;
    }

    @Put('sealed')
    @ApiOperation({ description: "Sealed bid" })
    async sealedBid(@Body() sealBidDTO:SealBidDTO){
        let sealeBid = this.bidService.sealedBid(sealBidDTO);
        return sealeBid;
    }

    @Get('all')
    @ApiOperation({ description: "Get all projects" })
    async getProjects(){
        let sealeBid = this.bidService.getProjects();
        return sealeBid;
    }

    @Post('getprojectbyid')
    @ApiOperation({ description: "Get project by it" })
    async getProjectById(@Body() findProjectByIdDTO:FindProjectByIdDTO){
        let getProjectById = this.bidService.findProjectByIdAndDisable(findProjectByIdDTO);
        return getProjectById;
    }

    @Post('bidsave')
    @ApiOperation({ description: "Get project by it" })
    async bidSave(@Body() saveDbInfoDTO:SaveDbInfoDTO){
        let bidToSave = this.bidService.saveBidInfo(saveDbInfoDTO);
        return bidToSave;
    }

    saveBidInfro
}
