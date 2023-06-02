import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetProjectByIdDTO } from './dto/get.project.by.id.dto';
import { ProjectService } from './project.service';
import { FindProjectByIdAndDisableDTO } from './../bid/dto/find.project.by.id.and.disable.dto';

@ApiTags('project')
@Controller('project')
export class ProjectController {

    constructor(
        private projectService: ProjectService,
    ) { }

    @Get('')
    @ApiOperation({ description: "Get all prjects" })
    async getAllProjects() {
        let getAllProjects = this.projectService.getProjects({ propose_status: "1" });
        return getAllProjects;
    }

    @Get('/:project_id')
    @ApiOperation({ description: "Get project by id" })
    async getById(@Param() getProjectByIdDTO: GetProjectByIdDTO) {
        let getProjectById = this.projectService.getProjectById(getProjectByIdDTO);
        return getProjectById;
    }

    @Post('getprojectbyid')
    @ApiOperation({ description: "Find project by id and disable." })
    async getProjectById(@Body() findProjectByIdAndDisableDTO: FindProjectByIdAndDisableDTO) {
        let getProjectById = this.projectService.findProjectByIdAndDisable(findProjectByIdAndDisableDTO);
        return getProjectById;
    }

}
