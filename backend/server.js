// index.js
import express from "express";
import bodyParser from "body-parser";
import { createAmazonBedrock } from "@ai-sdk/amazon-bedrock";
import { generateText } from "ai";

const app = express();
app.use(bodyParser.json());

const bedrock = createAmazonBedrock(); // uses AWS config/credentials

app.post("/ask", async (req, res) => {
  try {
    const { prompt, modelId } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    // fallback model if user doesn’t specify one
    const model = bedrock(modelId || "amazon.nova-lite-v1:0");

    const { text } = await generateText({
      model,
      prompt,
    });

    res.json({ result: text });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
