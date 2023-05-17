import { Injectable } from '@nestjs/common';
const { Configuration, OpenAIApi } = require("openai");
import { GenerateGptDTO } from './dto/generate.gpt.dto';



@Injectable()
export class GptService {

    async generateProroposal(generateGptDTO: GenerateGptDTO){

        const configuration = new Configuration({
            apiKey: process.env.OPENAI_API_KEY,
        });
        const openai = new OpenAIApi(configuration);

        // console.log('process.env.OPENAI_API_KEY',process.env.OPENAI_API_KEY)

        let prompt: string ;

        if(generateGptDTO.bio !== null && generateGptDTO.bio  !== undefined && generateGptDTO.bio.length > 0 ){
            prompt = " About me - '"+generateGptDTO.bio+"'  create proposal with maximum words 50 where you describe my short bio max 20 words and what can i do in a task. Here task text '"+ generateGptDTO.title +"'" 
        }else{
            // prompt = "You should create propose text without title to project with description what i can do.  Here task text '"+ generateGptDTO.title +"' maximum words is 40" 

            prompt = 'If client wants '+generateGptDTO.title+' what should I propose in maximum two sentances?'
        }

        try {
            const completion = await openai.createCompletion({
              model: "text-davinci-003",
              max_tokens: 250,
              prompt: prompt,
            });
            // console.log(completion.data.choices[0].text);

            return completion.data.choices[0].text;
          } catch (error) {
            if (error.response) {
              console.log(error.response.status);
              console.log(error.response.data);
            } else {
              console.log(error.message);
            }
          }

        // console.log('generateProroposal completion:',completion)

        // console.log('generateGptDTO', generateGptDTO)
        // return completion.data.choices[0].text;
    }
}
