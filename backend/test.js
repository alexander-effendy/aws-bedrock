import { createAmazonBedrock } from '@ai-sdk/amazon-bedrock';
import { generateText } from 'ai';

import 'dotenv/config';

const bedrock = createAmazonBedrock();

const { text } = await generateText({
  model: bedrock('amazon.nova-lite-v1:0'),
  prompt: 'Why is banana yellow?',
});

console.log(text);
