import {
  BedrockRuntimeClient,
  InvokeModelCommand,
  ConverseCommand,
} from "@aws-sdk/client-bedrock-runtime";

const client = new BedrockRuntimeClient();

/**
 * 
 * @param {*} modelId 
 * @param {*} inputText 
 * 
 * See all the available models in ap-southeast-2 (Sydney) by running this command:
 *  aws bedrock list-foundation-models --region ap-southeast-2
 */

// Helper: Run InvokeModel models (Titan, etc.)
async function runInvokeModel(modelId, inputText) {
  console.log(`\n=== ${modelId} ===`);
  try {
    const command = new InvokeModelCommand({
      modelId,
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify({ inputText, textGenerationConfig: { maxTokenCount: 512 } }),
    });
    const response = await client.send(command);
    const json = JSON.parse(new TextDecoder().decode(response.body));
    console.log(json.results[0].outputText);
  } catch (err) {
    console.error(`Error with ${modelId}:`, err);
  }
}

// Helper: Run Claude models (ConverseCommand)
async function runConverseModel(modelId, prompt) {
  console.log(`\n=== ${modelId} ===`);
  try {
    const command = new ConverseCommand({
      modelId,
      messages: [{ role: "user", content: [{ text: prompt }] }],
      inferenceConfig: { maxTokens: 512, temperature: 0.5 },
    });
    const response = await client.send(command);
    console.log(response.output.message.content[0].text);
  } catch (err) {
    console.error(`Error with ${modelId}:`, err);
  }
}

async function main() {
  const inputText = "Explain why the banana is yellow in one sentence.";
  // Amazons
  await runConverseModel("amazon.titan-text-lite-v1", inputText);
  await runConverseModel("amazon.titan-text-express-v1", inputText);
  await runConverseModel("amazon.nova-micro-v1:0", inputText);
  await runConverseModel("amazon.nova-lite-v1:0", inputText);
  await runConverseModel("amazon.nova-pro-v1:0", inputText);

  // Claudes
  await runConverseModel("anthropic.claude-3-haiku-20240307-v1:0", inputText);
  await runConverseModel("anthropic.claude-3-sonnet-20240229-v1:0", inputText);
  await runConverseModel("anthropic.claude-3-5-sonnet-20241022-v2:0", inputText);

  // Mistrals
  await runConverseModel("mistral.mistral-7b-instruct-v0:2", inputText);
  await runConverseModel("mistral.mistral-large-2402-v1:0", inputText);
}

main();
