import { Body, Controller, Post } from '@nestjs/common';
import { GptService } from './gpt.service';
import { GenerateGptDTO } from './dto/generate.gpt.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('gpt')
@Controller('gpt')
export class GptController {

    constructor(
        private gptService: GptService,
      ) {}

      @Post('generate')
      @ApiOperation({ description: "Generate proposal" })
      async generateProposal(@Body() generateGptDTO:GenerateGptDTO){
          console.log('generate generateGptDTO', generateGptDTO)
          let proposal = await this.gptService.generateProroposal(generateGptDTO)
          console.log('generate proposal', proposal)
          return proposal;
      }


}
