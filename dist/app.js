"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const chat_1 = __importDefault(require("./route/chat"));
const cors_1 = __importDefault(require("cors"));
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
const port = process.env.PORT || 4000;
const app = (0, express_1.default)();
app.use((0, cors_1.default)(corsOptions));
app.use(chat_1.default);
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
