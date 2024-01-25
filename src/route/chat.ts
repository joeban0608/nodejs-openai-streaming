import { Router } from "express";
import OpenAI from "openai";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";
// console.log("OPENAI_API_KEY", OPENAI_API_KEY);
const client = new OpenAI({
  apiKey: OPENAI_API_KEY,
});
const router = Router();

type ChatMessages = OpenAI.Chat.Completions.ChatCompletionMessageParam[];

const getStreamingCompletion = async (chatMessages: ChatMessages) => {
  const messagesTrunked = chatMessages.slice(-6);
  // console.log("messagesTrunked", messagesTrunked);
  return client.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [...messagesTrunked],
    stream: true,
  });
};

router.get("/", (req, res, next) => {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  return res.json({ data: "hello, here is chat get response, success" });
});
router.post("/chat", async (req, res, next) => {
  res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
  if (!OPENAI_API_KEY) {
    throw Error("OPENAI_API_KEY did not get");
  }
  // console.log("req.body", req.body);
  const messages = req.body.messages;
  // console.log("===messages", messages);
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
export default router;
