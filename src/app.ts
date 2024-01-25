import express from "express";
import chatRoutes from "./route/chat";
import cors from "cors";
import bodyParser from "body-parser";

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
const port = process.env.PORT || 3000;
const app = express();

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(chatRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
