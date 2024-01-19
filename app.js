import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import OpenAI from "openai";
// import dotenv from "dotenv";
// dotenv.config();
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const port = process.env.PORT || 4000;

const client = new OpenAI({
  apiKey: OPENAI_API_KEY || "",
});

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
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://localhost:4000",
    "https://chat.katsuwin.info",
  ],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));
app.get("/", (req, res) => {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  return res.json({ data: "success" });
});

app.post("/chat", async (req, res) => {
  res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
  if (!OPENAI_API_KEY) {
    throw Error("OPENAI_API_KEY did not get");
  }
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
