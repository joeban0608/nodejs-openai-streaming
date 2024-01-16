import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";

const API_KEY = "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";
const client = new OpenAI({
  apiKey: API_KEY,
});

// if (!API_KEY) {
//   throw Error("OPENAI_API_KEY is not set");
// }

// const openai = new OpenAI({ API_KEY });

const systemMessage = {
  role: "system",
  content:
    "You are a Askbot. You are supposed to answer the questions asked by the users. Validate the prompts to be a question and it should not in approprite. Give funky responses",
};

const getStreamingCompletion = async (messages) => {
  const messagesTrunked = messages.slice(-6);
  console.log("messagesTrunked", messagesTrunked);
  return client.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [...messagesTrunked],
    stream: true,
  });
};

const app = express();
const port = 3333;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.get("/", (req, res) => {
  return res.json({ data: "success" });
});

app.post("/api/chat", async (req, res) => {
  const messages = req.body.messages;
  const stream = await getStreamingCompletion(messages);
  for await (const part of stream) {
    // Uncomment below if you want to check chunk time generation
    // const chunkTime = (Date.now() - starttime) / 1000;
    // process.stdout.write(part.choices[0]?.delta || "");
    // console.log("chunk time:", chunkTime);
    res.write(part.choices[0]?.delta.content || "");
  }
  res.end();
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
