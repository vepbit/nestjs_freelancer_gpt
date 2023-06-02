import { Test, TestingModule } from '@nestjs/testing';
import { ProjectService } from './project.service';
import { TypeORMMySqlTestingModule } from '../test-utils/TypeORMMySqlTestingModule';
import { TypeOrmModule } from '@nestjs/typeorm';

import { List } from './../entities/list.entity';

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

describe('ProjectService', () => {
  let service: ProjectService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjectService],
      imports: [
        TypeORMMySqlTestingModule([List]),
        TypeOrmModule.forFeature([List]),
      ],
    }).compile();

    service = module.get<ProjectService>(ProjectService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Check if there are connection with db', () => {

    it('should return a project with given id', async () => {
      let project_id = 36559973;
      const { projectid: projectid, status: status } = await service.getProjectById({
        project_id: project_id,
      });

      expect(status).toBe('active');
      expect(projectid).toBe(project_id);
    });

  });
});
