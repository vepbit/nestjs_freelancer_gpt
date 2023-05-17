import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, IsNull } from "typeorm"

import { CreateBidDTO } from './dto/create.bid.dto';
import { SealBidDTO } from './dto/sealed.bid.dto';
import { Dialogflow } from 'src/entities/dialogflow.entity';
import { Repository } from 'typeorm';
import { List } from 'src/entities/list.entity';
import { SaveDbInfoDTO } from './dto/save.db.info.dto';
import { FindProjectByIdDTO } from './dto/find.project.by.id.dto';
import { Bids } from 'src/entities/bids.entity';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class BidService {

    constructor(
        private httpService: HttpService,
        @InjectRepository(Dialogflow) private dialogflowRepository: Repository<Dialogflow>,
        @InjectRepository(List) private listOfProjectsRepository: Repository<List>,
        @InjectRepository(Bids) private bidsRepository: Repository<Bids>


        
      ) {}

    /**
     * Here request to remove aws resources 
     */
    async publishPropose(createBidDTO:CreateBidDTO){
        console.log('publishPropose createBidDTO',createBidDTO)

        // return createBidDTO;


        console.log('removeNukeByLink createBidDTO',createBidDTO)
        
        let freelancer_link = process.env.FRELANCER_API_LINK+'?compact='


        // const url = process.env.NUKE_URL;
        // let dataToLambda = credentials;

        console.log('publishPropose url',freelancer_link)
        console.log('publishPropose url',process.env.FRELANCER_API_KEY)


        try{
            const  {data}  = await lastValueFrom(this.httpService.post(freelancer_link, createBidDTO,{
                headers: {
                    'Content-Type': 'application/json',
                    'freelancer-oauth-v1': process.env.FRELANCER_API_KEY
                }
            }));
            console.log('publishPropose data', data)

            return data;
        }catch(err){
            // console.log('err',err);
            console.log('err code:',err.response.data);

            // throw new HttpException(err.response.data, HttpStatus.BAD_REQUEST)
            return err.response.data
        }




    }

    async sealedBid(sealBidDTO:SealBidDTO){

        // return sealBidDTO;

        console.log('removeNukeByLink sealBidDTO',sealBidDTO)
        
        let freelancer_link = process.env.FRELANCER_API_LINK+sealBidDTO.bid_id+'?compact=true&new_errors=true&new_pools=true';
        let freelancer_data = {action: sealBidDTO.action};


        // const url = process.env.NUKE_URL;
        // let dataToLambda = credentials;

        console.log('publishPropose url',freelancer_link)
        console.log('publishPropose FRELANCER_API_KEY',process.env.FRELANCER_API_KEY)
        console.log('publishPropose freelancer_data',freelancer_data)



        try{
            const  {data}  = await lastValueFrom(this.httpService.put(freelancer_link, freelancer_data,{
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'freelancer-oauth-v1': process.env.FRELANCER_API_KEY
                }
            }));
            console.log('publishPropose data', data)

            return data;
        }catch(err){
            // console.log('err',err);
            console.log('err code:',err.response.data);

            // throw new HttpException(err.response.data, HttpStatus.BAD_REQUEST)

            return err.response.data;
        }
    }
    async getProjects(){
        return await this.listOfProjectsRepository.findBy({
            propose_status: Equal("2"),
            frontend_project_status: Equal("open"),
            bidstatus: IsNull()
        })
    }


    async findProjectByIdAndDisable(findProjectByIdDTO:FindProjectByIdDTO){

        let project = await this.listOfProjectsRepository.findOneBy({ projectid: findProjectByIdDTO.project_id })

        project.bidstatus =findProjectByIdDTO.bidstatus;

        let savedProject = await this.listOfProjectsRepository.save(project);

        console.log('findProjectByIdAndDisable savedProject', savedProject)
        return savedProject;

    }

    async saveBidInfo(saveDbInfoDTO:SaveDbInfoDTO){

        let bid:SaveDbInfoDTO = {
            project_id: saveDbInfoDTO.project_id,
            time_submitted: saveDbInfoDTO.time_submitted,
            milestone_percentage: saveDbInfoDTO.milestone_percentage,
            period: saveDbInfoDTO.period,
            amount: saveDbInfoDTO.amount,
            description: saveDbInfoDTO.description,
            status: saveDbInfoDTO.status
        }

        let savedBid= await this.bidsRepository.save(bid)

        return savedBid;
    }

    @Cron('45 * * * * *')
    async autoBid() {
        console.debug('cron is on....')

        let projects = await this.getProjects();


        for (let index = 0; index < projects.length; index++) {

            let item= projects[index];
            let amount = typeof item.propose_amount;

            let period = Number(item.propose_period) > 0 ? Number(item.propose_period) : 14

            if(item.propose_amount===null){
                await this.findProjectByIdAndDisable(
                    {
                        project_id: item.projectid,
                        description: item.propose_text,
                        bidstatus: 'error'
                    })
                    throw new HttpException('No amount exsist', HttpStatus.BAD_REQUEST)
            }

            if(item.propose_text.length <= 100){
                await this.findProjectByIdAndDisable(
                    {
                        project_id: item.projectid,
                        description: item.propose_text,
                        bidstatus: 'error'
                    })
                    throw new HttpException('Too short text of propose', HttpStatus.BAD_REQUEST)
            }



            console.log('autoBid typeof item.propose_amount',amount)

            console.log('autoBid item.propose_amount',item.propose_amount)

            console.log('autoBid process.env.BIDER_ID', process.env.BIDER_ID)

            let propose:CreateBidDTO = {
                project_id: item.projectid,
                bidder_id: Number(process.env.BIDER_ID),
                amount: Number(item.propose_amount),
                period: period,
                milestone_percentage: 50,
                sealed: false,
                description: item.propose_text
            }


            let publishedBid = await this.publishPropose(propose)


            if(publishedBid.status==="success"){

                let bid_id = publishedBid.result.id;
                let toSeal = await this.sealedBid(
                    {
                        action: "seal",
                        bid_id: bid_id
                    }
                    )
                    console.log('autoBid toSeal', toSeal)

                    if(toSeal.status==="success"){
                        let toSaveData:SaveDbInfoDTO = {
                            project_id: propose.project_id,
                            time_submitted: publishedBid.result.time_submitted,
                            milestone_percentage: propose.milestone_percentage,
                            period: propose.period,
                            amount: propose.amount,
                            description: propose.description,
                            status: 'success'
                        }
                        let toSave = await this.saveBidInfo(toSaveData);

                        console.log('autoBid toSave', toSave)


                        let toUpdateListProject = await this.findProjectByIdAndDisable(
                            {
                                project_id: item.projectid,
                                description: item.propose_text,
                                bidstatus: 'success'
                            })

                            console.log('autoBid toUpdateListProject', toUpdateListProject)
                    }


            }else if(publishedBid.status==="error"){
                await this.findProjectByIdAndDisable(
                    {
                        project_id: item.projectid,
                        description: item.propose_text,
                        bidstatus: 'error'
                    })
                    throw new HttpException(publishedBid.message, HttpStatus.BAD_REQUEST)
            }

            console.log('autoBid publishedBid ' ,publishedBid)

            console.log('....start')
            console.log('item',item)
            console.log('....end')

        }

        // console.log(projects)
    }
}
