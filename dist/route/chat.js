"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const openai_1 = __importDefault(require("openai"));
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const client = new openai_1.default({
    apiKey: OPENAI_API_KEY || "",
});
const router = (0, express_1.Router)();
const getStreamingCompletion = (chatMessages) => __awaiter(void 0, void 0, void 0, function* () {
    const messagesTrunked = chatMessages.slice(-6);
    console.log("messagesTrunked", messagesTrunked);
    return client.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [...messagesTrunked],
        stream: true,
    });
});
router.get("/", (req, res, next) => {
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    return res.json({ data: "hello, here is chat get response, success" });
});
router.post("/chat", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_1, _b, _c;
    var _d;
    res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
    if (!OPENAI_API_KEY) {
        throw Error("OPENAI_API_KEY did not get");
    }
    const messages = req.body.messages;
    const stream = yield getStreamingCompletion(messages);
    try {
        for (var _e = true, stream_1 = __asyncValues(stream), stream_1_1; stream_1_1 = yield stream_1.next(), _a = stream_1_1.done, !_a; _e = true) {
            _c = stream_1_1.value;
            _e = false;
            const part = _c;
            // Uncomment below if you want to check chunk time generation
            // const chunkTime = (Date.now() - starttime) / 1000;
            // process.stdout.write(part.choices[0]?.delta || "");
            // console.log("chunk time:", chunkTime);
            res.write(((_d = part.choices[0]) === null || _d === void 0 ? void 0 : _d.delta.content) || "");
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (!_e && !_a && (_b = stream_1.return)) yield _b.call(stream_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    res.end();
}));
exports.default = router;
