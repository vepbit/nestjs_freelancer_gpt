import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, IsNull } from "typeorm"

import { CreateBidDTO } from './dto/create.bid.dto';
import { SealBidDTO } from './dto/sealed.bid.dto';
import { Dialogflow } from './../entities/dialogflow.entity';
import { Repository } from 'typeorm';
import { SaveDbInfoDTO } from './dto/save.db.info.dto';
import { List } from './../entities/list.entity';
import { Bids } from './../entities/bids.entity';
import { Cron } from '@nestjs/schedule';
import { FindProjectByIdAndDisableDTO } from './dto/find.project.by.id.and.disable.dto';
import { ProjectService } from './../project/project.service';

@Injectable()
export class BidService {

    constructor(
        private httpService: HttpService,
        private projectService: ProjectService,
        @InjectRepository(Bids) private bidsRepository: Repository<Bids>
    ) { }

    /**
     * Here I publish bid on freelancer website.
     */
    async publisBid(createBidDTO: CreateBidDTO) {

        let freelancer_link = process.env.FRELANCER_API_LINK + '?compact='

        try {
            const { data } = await lastValueFrom(this.httpService.post(freelancer_link, createBidDTO, {
                headers: {
                    'Content-Type': 'application/json',
                    'freelancer-oauth-v1': process.env.FRELANCER_API_KEY
                }
            }));
            console.log('publishPropose data', data)

            return data;
        } catch (err) {
            // console.log('err',err);
            console.log('err code:', err.response.data);

            // throw new HttpException(err.response.data, HttpStatus.BAD_REQUEST)
            return err.response.data
        }

    }


    /**
     * Here I seal bid from other freelancers.
     */
    async sealedBid(sealBidDTO: SealBidDTO) {

        let freelancer_link = process.env.FRELANCER_API_LINK + sealBidDTO.bid_id + '?compact=true&new_errors=true&new_pools=true';
        let freelancer_data = { action: sealBidDTO.action };

        try {
            const { data } = await lastValueFrom(this.httpService.put(freelancer_link, freelancer_data, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'freelancer-oauth-v1': process.env.FRELANCER_API_KEY
                }
            }));
            console.log('publishPropose data', data)

            return data;
        } catch (err) {
            // console.log('err',err);
            console.log('err code:', err.response.data);

            // throw new HttpException(err.response.data, HttpStatus.BAD_REQUEST)

            return err.response.data;
        }
    }
    /**
     * Here I save bit text to db
     */
    async saveBidInfo(saveDbInfoDTO: SaveDbInfoDTO) {

        let bid: SaveDbInfoDTO = {
            project_id: saveDbInfoDTO.project_id,
            time_submitted: saveDbInfoDTO.time_submitted,
            milestone_percentage: saveDbInfoDTO.milestone_percentage,
            period: saveDbInfoDTO.period,
            amount: saveDbInfoDTO.amount,
            description: saveDbInfoDTO.description,
            status: saveDbInfoDTO.status
        }

        let savedBid = await this.bidsRepository.save(bid)

        return savedBid;
    }


    /**
     * Cron for autobid. It work every 45 seconds. 
     */
    @Cron('45 * * * * *')
    async autoBid() {
        console.debug('The automated bidding scheduler is functioning....')

        let projects = await this.projectService.getProjects({ propose_status: "3" });

        for (let index = 0; index < projects.length; index++) {

            let item = projects[index];
            let period = Number(item.propose_period) > 0 ? Number(item.propose_period) : 14

            if (item.propose_amount === null) {
                await this.projectService.findProjectByIdAndDisable(
                    {
                        project_id: item.projectid,
                        description: item.propose_text,
                        bidstatus: 'error'
                    })
                throw new HttpException('No amount exsist', HttpStatus.BAD_REQUEST)
            }

            if (item.propose_text.length <= 100) {
                await this.projectService.findProjectByIdAndDisable(
                    {
                        project_id: item.projectid,
                        description: item.propose_text,
                        bidstatus: 'error'
                    })
                throw new HttpException('Too short text of propose', HttpStatus.BAD_REQUEST)
            }

            let propose: CreateBidDTO = {
                project_id: item.projectid,
                bidder_id: Number(process.env.BIDER_ID),
                amount: Number(item.propose_amount),
                period: period,
                milestone_percentage: 50,
                sealed: false,
                description: item.propose_text
            }

            let publishedBid = await this.publisBid(propose)

            if (publishedBid.status === "success") {
                let bid_id = publishedBid.result.id;
                let toSeal = await this.sealedBid(
                    {
                        action: "seal",
                        bid_id: bid_id
                    }
                )
                console.log('autoBid toSeal', toSeal)

                if (toSeal.status === "success") {
                    let toSaveData: SaveDbInfoDTO = {
                        project_id: propose.project_id,
                        time_submitted: publishedBid.result.time_submitted,
                        milestone_percentage: propose.milestone_percentage,
                        period: propose.period,
                        amount: propose.amount,
                        description: propose.description,
                        status: 'success'
                    }
                    let toSave = await this.saveBidInfo(toSaveData);

                    let toUpdateListProject = await this.projectService.findProjectByIdAndDisable(
                        {
                            project_id: item.projectid,
                            description: item.propose_text,
                            bidstatus: 'success'
                        })

                    console.log('autoBid toUpdateListProject', toUpdateListProject)
                }


            } else if (publishedBid.status === "error") {
                await this.projectService.findProjectByIdAndDisable(
                    {
                        project_id: item.projectid,
                        description: item.propose_text,
                        bidstatus: 'error'
                    })
                throw new HttpException(publishedBid.message, HttpStatus.BAD_REQUEST)
            }
        }
    }
}
