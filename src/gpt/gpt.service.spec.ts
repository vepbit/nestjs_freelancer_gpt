import { Test, TestingModule } from '@nestjs/testing';
import { GptService } from './gpt.service';

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

describe('GptService', () => {
  let service: GptService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GptService],
    }).compile();

    service = module.get<GptService>(GptService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Generate propose with ChatGPT ', () => {

    it(' should create propose ', async () => {
      let proposedata = {
        bio: 'create wordpress website',
        title: ''
      }

      let newPropose = await service.generateProroposal(proposedata)

      expect(newPropose.status).toBe('success');
      expect(newPropose.text.length).toBeGreaterThan(5);

    });

  });

});
