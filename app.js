import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import OpenAI from "openai";
// import dotenv from "dotenv";
// dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
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
const port = process.env.PORT;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
const corsOptions = {
  origin: ["http://localhost:5173"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

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
