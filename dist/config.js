"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
function loadConfig() {
    try {
        const configPath = (0, path_1.join)(process.cwd(), 'config.json');
        return JSON.parse((0, fs_1.readFileSync)(configPath, 'utf8'));
    }
    catch (error) {
        console.error('Failed to load config file', error);
        throw error;
    }
}
exports.config = loadConfig();
