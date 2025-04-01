"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.build = build;
const vscode_1 = __importDefault(require("vscode"));
const utils_1 = require("../utils/utils");
const lw_1 = require("../lw");
const queue_1 = require("./queue");
/**
 * Build LaTeX project using external command. This function creates a
 * {@link Tool} containing the external command info and adds it to the
 * queue. After that, this function tries to initiate a {@link buildLoop} if
 * there is no one running.
 *
 * @param {string} command - The command to execute for building the project.
 * @param {string[]} args - The arguments to pass to the build command.
 * @param {string} pwd - The current working directory for the build.
 * @param {() => Promise<void>} buildLoop - A function that represents the build loop.
 * @param {string} [rootFile] - Optional. The root file for the build.
 */
async function build(command, args, pwd, buildLoop, rootFile) {
    // Save all open files in the workspace
    await vscode_1.default.workspace.saveAll();
    // Determine the current working directory for the build
    const workspaceFolder = vscode_1.default.workspace.workspaceFolders?.[0];
    const cwd = workspaceFolder?.uri.fsPath || pwd;
    // Replace argument placeholders if a root file is provided
    if (rootFile !== undefined) {
        const replaceFn = (0, utils_1.replaceArgumentPlaceholders)(rootFile, lw_1.lw.file.tmpDirPath);
        args = args.map(replaceFn);
    }
    // Create a Tool object representing the build command and arguments
    const tool = { name: command, command, args };
    // Add the build tool to the queue for execution
    queue_1.queue.add(tool, rootFile, 'External', Date.now(), true, cwd);
    lw_1.lw.compile.compiledPDFPath = rootFile ? lw_1.lw.file.getPdfPath(rootFile) : '';
    // Execute the build loop
    await buildLoop();
}
//# sourceMappingURL=external.js.map