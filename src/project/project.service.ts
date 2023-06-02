import { Injectable } from '@nestjs/common';
import { GetProjectByIdDTO } from './dto/get.project.by.id.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpService } from '@nestjs/axios';
import { Equal, IsNull, Repository } from 'typeorm';

import { List } from './../entities/list.entity';
import { GetProjectsDTO } from './dto/get.projects.dto';
import { FindProjectByIdAndDisableDTO } from 'src/bid/dto/find.project.by.id.and.disable.dto';

@Injectable()
export class ProjectService {

    constructor(
        @InjectRepository(List) private listOfProjectsRepository: Repository<List>,
    ) { }

    /**
     * Get list of projects
     */
    async getProjects(getProjectsDTO: GetProjectsDTO) {
        return await this.listOfProjectsRepository.findBy({
            propose_status: Equal(getProjectsDTO.propose_status),
            frontend_project_status: Equal("open"),
            bidstatus: IsNull()
        })
    }


    /**
     * Get project by project_id
     */
    async getProjectById(getProjectByIdDTO: GetProjectByIdDTO) {

        let project = await this.listOfProjectsRepository.findOneBy({ projectid: getProjectByIdDTO.project_id })
        return project;

    }

    /**
     * Get project by project_id and update bid status
     */
    async findProjectByIdAndDisable(findProjectByIdAndDisableDTO: FindProjectByIdAndDisableDTO) {

        let project = await this.listOfProjectsRepository.findOneBy({ projectid: findProjectByIdAndDisableDTO.project_id })

        project.bidstatus = findProjectByIdAndDisableDTO.bidstatus;

        let savedProject = await this.listOfProjectsRepository.save(project);

        console.log('findProjectByIdAndDisable savedProject', savedProject)
        return savedProject;

    }
}
