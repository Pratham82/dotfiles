"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkCitations = checkCitations;
const os_1 = require("os");
const lw_1 = require("../lw");
const logger = lw_1.lw.log('Citations', 'Linter');
function checkCitations() {
    logger.log('Checking citations.');
    const auxFile = lw_1.lw.root.file.path?.replace(/\.tex$/, '.aux');
    if (!auxFile) {
        logger.log('No aux file found.');
        return [];
    }
    const { stdout, error } = lw_1.lw.external.sync('checkcites', ['-u', auxFile], {
        cwd: lw_1.lw.root.dir.path,
    });
    if (error) {
        logger.logError('Error checking citations.', error);
        return [];
    }
    const result = stdout
        .toString()
        .split(os_1.EOL)
        .filter(l => l.startsWith('=>'))
        .map(l => l.slice(2).trim());
    logger.log(`Found ${result.length} unused citation(s).`);
    return result;
}
//# sourceMappingURL=checkcites.js.map