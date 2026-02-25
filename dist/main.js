"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("./api");
const config_1 = require("./config");
const edit_1 = require("./edit");
const file_1 = require("./file");
async function main() {
    try {
        await (0, file_1.createOutputDirectory)();
        const [cnApiResponse, championDataResponse] = await Promise.all([
            (0, api_1.fetchData)(config_1.config.CN_API_URL),
            (0, api_1.fetchData)(config_1.config.CHAMPION_DATA_URL),
        ]);
        const firstEntry = Object.values(cnApiResponse.data.data['0'] ?? {})?.[0]?.[0];
        const date = firstEntry?.dtstatdate
            ? new Date(firstEntry.dtstatdate).toISOString()
            : new Date().toISOString();
        const mergedStats = (0, edit_1.convertToMergedStats)(cnApiResponse.data, championDataResponse.data, date);
        await (0, file_1.writeJsonFile)(mergedStats);
        console.log(config_1.config.MESSAGE_SUCCESS.PROCESS_COMPLETE);
    }
    catch (error) {
        console.error(config_1.config.MESSAGE_ERROR.PROCESS_ERROR, error);
        process.exit(1);
    }
}
main();
