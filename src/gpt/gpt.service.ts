import { Injectable } from '@nestjs/common';
import { Configuration, OpenAIApi } from "openai";
import { GenerateGptDTO } from './dto/generate.gpt.dto';



@Injectable()
export class GptService {

	/**
	 * Generate propose with help of ChatGPT
	 */
	async generateProroposal(generateGptDTO: GenerateGptDTO) {
		const configuration = new Configuration({
			apiKey: process.env.OPENAI_API_KEY,
		});

		const openai = new OpenAIApi(configuration);
		let prompt: string;

		if (generateGptDTO.bio !== null && generateGptDTO.bio !== undefined && generateGptDTO.bio.length > 0) {
			prompt = " About me - '" + generateGptDTO.bio + "'  create proposal with maximum words 50 where you describe my short bio max 20 words and what can i do in a task. Here task text '" + generateGptDTO.title + "'"
		} else {
			prompt = 'If client wants ' + generateGptDTO.title + ' what should I propose in maximum two sentances?'
		}

		try {
			const completion = await openai.createCompletion({
				model: "text-davinci-001",
				max_tokens: 250,
				prompt: prompt,
			});
			return {
				status: 'success',
				text: completion.data.choices[0].text
			};
		} catch (error) {
			if (error.response) {
				console.log(error.response);
			}
		}
	}
}
