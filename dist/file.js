"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOutputDirectory = createOutputDirectory;
exports.writeJsonFile = writeJsonFile;
const fs_1 = require("fs");
const config_1 = require("./config");
const path_1 = require("path");
async function createOutputDirectory() {
    try {
        (0, fs_1.mkdirSync)(config_1.config.OUTPUT_FOLDER_NAME, { recursive: true });
        console.log(config_1.config.MESSAGE_SUCCESS.FOLDER_CREATE);
    }
    catch (error) {
        console.error(config_1.config.MESSAGE_ERROR.FOLDER_CREATE, error);
        throw error;
    }
}
async function writeJsonFile(data) {
    try {
        const outputPath = (0, path_1.join)(config_1.config.OUTPUT_FOLDER_NAME, config_1.config.OUTPUT_FILE_NAME);
        (0, fs_1.writeFileSync)(outputPath, JSON.stringify(data, null, 2), 'utf-8');
        console.log(config_1.config.MESSAGE_SUCCESS.JSON_WRITE);
    }
    catch (error) {
        console.error(config_1.config.MESSAGE_ERROR.JSON_WRITE, error);
        throw error;
    }
}
