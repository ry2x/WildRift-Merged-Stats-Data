"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchData = fetchData;
const axios_1 = __importDefault(require("axios"));
const config_1 = require("./config");
async function fetchData(url) {
    try {
        return await axios_1.default.get(url);
    }
    catch (error) {
        console.error(config_1.config.MESSAGE_ERROR.DATA_FETCH, error);
        throw error;
    }
}
