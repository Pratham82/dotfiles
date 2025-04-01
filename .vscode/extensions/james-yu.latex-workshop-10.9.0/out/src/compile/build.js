"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.autoBuild = autoBuild;
exports.build = build;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
const quick_pick_1 = require("../utils/quick-pick");
const lw_1 = require("../lw");
const recipe_1 = require("./recipe");
const external_1 = require("./external");
const queue_1 = require("./queue");
const logger = lw_1.lw.log('Build');
lw_1.lw.watcher.src.onChange(filePath => autoBuild(filePath.fsPath, 'onFileChange'));
lw_1.lw.watcher.bib.onChange(filePath => autoBuild(filePath.fsPath, 'onFileChange', true));
/**
 * Triggers auto build based on file change or file save events. If the
 * configuration allows auto-build for the given event type, it initiates the
 * build process for the affected file.
 *
 * @param {string} file - The path of the file that triggered the auto build.
 * @param {'onFileChange' | 'onSave'} type - The type of event that triggered
 * the auto build.
 * @param {boolean} bibChanged - Indicates whether the bibliography file has
 * changed.
 */
function autoBuild(file, type, bibChanged = false) {
    const configuration = vscode.workspace.getConfiguration('latex-workshop', lw_1.lw.file.toUri(file));
    if (configuration.get('latex.autoBuild.run') !== type) {
        return;
    }
    logger.log('Auto build started ' + (type === 'onFileChange' ? 'detecting the change of a file' : 'on saving file') + `: ${file} .`);
    lw_1.lw.event.fire(lw_1.lw.event.AutoBuildInitiated, { type, file });
    if (!canAutoBuild()) {
        logger.log('Autobuild temporarily disabled.');
        return;
    }
    lw_1.lw.compile.lastAutoBuildTime = Date.now();
    if (!bibChanged && lw_1.lw.root.subfiles.path && configuration.get('latex.rootFile.useSubFile')) {
        return build(true, lw_1.lw.root.subfiles.path, lw_1.lw.root.subfiles.langId);
    }
    else {
        return build(true, lw_1.lw.root.file.path, lw_1.lw.root.file.langId);
    }
}
/**
 * Determines whether an auto-build on save or on change can be triggered.
 * Two conditions are considered: the presence of `latex.autoBuild.interval`
 * configuration and avoiding unwanted auto-build triggered by `saveAll()`
 * during a previous building process.
 *
 * @returns {boolean} - True if auto-build can be triggered, false otherwise.
 */
function canAutoBuild() {
    const configuration = vscode.workspace.getConfiguration('latex-workshop', lw_1.lw.root.file.path ? lw_1.lw.file.toUri(lw_1.lw.root.file.path) : undefined);
    return Date.now() - lw_1.lw.compile.lastAutoBuildTime >= configuration.get('latex.autoBuild.interval', 1000);
}
let isBuilding = false;
/**
 * Initiates the build process for the LaTeX project. It can build the entire
 * project or a specific root file depending on the parameters.
 *
 * This function checks if the active editor is defined, and if not, logs an
 * error message and returns. It then determines the workspace and configuration
 * based on the provided or inferred root file. If an external build command is
 * configured, it spawns the external build process. If the root file is not
 * defined or the language ID is not defined, it logs an error and returns. If
 * the subfile package is used and the user has not chosen to skip the file
 * selection, it prompts the user to select a subfile. Finally, it logs
 * information about the build and initiates the build process using the
 * appropriate recipe.
 *
 * @param {boolean} skipSelection - Whether to skip the file selection prompt.
 * @param {string | undefined} rootFile - The path of the LaTeX root file.
 * @param {string | undefined} languageId - The language ID of the root file.
 * @param {string | undefined} recipe - The name of the recipe to use for the
 * build.
 */
async function build(skipSelection = false, rootFile = undefined, languageId = undefined, recipe = undefined) {
    const activeEditor = vscode.window.activeTextEditor;
    if (!activeEditor) {
        logger.log('Cannot start to build because the active editor is undefined.');
        return;
    }
    logger.log(`The document of the active editor: ${activeEditor.document.uri.toString(true)}`);
    logger.log(`The languageId of the document: ${activeEditor.document.languageId}`);
    const workspace = rootFile ? lw_1.lw.file.toUri(rootFile) : activeEditor.document.uri;
    const configuration = vscode.workspace.getConfiguration('latex-workshop', workspace);
    const externalBuildCommand = configuration.get('latex.external.build.command');
    const externalBuildArgs = configuration.get('latex.external.build.args');
    if (rootFile === undefined && lw_1.lw.file.hasTeXLangId(activeEditor.document.languageId)) {
        await lw_1.lw.root.find();
        rootFile = lw_1.lw.root.file.path;
        languageId = lw_1.lw.root.file.langId;
    }
    if (externalBuildCommand) {
        // Check if a build is already in progress
        if (isBuilding) {
            void logger.showErrorMessageWithCompilerLogButton('Please wait for the current build to finish.');
        }
        else {
            const pwd = path.dirname(rootFile ? rootFile : activeEditor.document.fileName);
            await (0, external_1.build)(externalBuildCommand, externalBuildArgs, pwd, buildLoop, rootFile);
        }
        return;
    }
    if (rootFile === undefined || languageId === undefined) {
        logger.log('Cannot find LaTeX root file. See https://github.com/James-Yu/LaTeX-Workshop/wiki/Compile#the-root-file');
        return;
    }
    let pickedRootFile = rootFile;
    if (!skipSelection && lw_1.lw.root.subfiles.path) {
        // We are using the subfile package
        pickedRootFile = await (0, quick_pick_1.pickRootPath)(rootFile, lw_1.lw.root.subfiles.path, 'compile');
        if (!pickedRootFile) {
            return;
        }
    }
    logger.log(`Building root file: ${pickedRootFile}`);
    await (0, recipe_1.build)(pickedRootFile, languageId, buildLoop, recipe);
}
/**
 * Checks if another build loop is already running. If not, it iterates through
 * the queue and executes each Tool one by one.
 *
 * This function first checks if a build is already in progress. If it is, it
 * returns early. Otherwise, it sets the `compiling` flag to true and the
 * `lastBuildTime` to the current timestamp. It then enters a loop where it
 * dequeues steps from the queue. For each step, it spawns the process and
 * monitors the process until completion. After each step, it checks if it's the
 * last step and performs cleanup if necessary. Finally, it sets the `compiling`
 * flag to false.
 */
async function buildLoop() {
    if (isBuilding) {
        logger.log('Another build loop is already running.');
        return;
    }
    isBuilding = true;
    lw_1.lw.compile.compiledPDFWriting++;
    // Stop watching the PDF file to avoid reloading the PDF viewer twice.
    // The builder will be responsible for refreshing the viewer.
    let skipped = true;
    while (true) {
        const step = queue_1.queue.getStep();
        if (step === undefined) {
            break;
        }
        const env = spawnProcess(step);
        const success = await monitorProcess(step, env);
        skipped = skipped && !step.isExternal && step.isSkipped;
        if (success && queue_1.queue.isLastStep(step)) {
            await afterSuccessfulBuilt(step, skipped);
        }
    }
    isBuilding = false;
    setTimeout(() => lw_1.lw.compile.compiledPDFWriting--, vscode.workspace.getConfiguration('latex-workshop').get('latex.watch.pdf.delay') * 2);
}
/**
 * Spawns a child process for the specified step. The function creates the
 * environment variables needed for the step and spawns a process according to
 * the nature of the step: a magic command (tex or bib), a recipe tool, or an
 * external command.
 *
 * Based on the type of step, this function sets the current working directory
 * (`cwd`) for the spawn command. If the step represents a magic command (tex or
 * bib), it uses a shell to execute the command with optional arguments. If the
 * step is not external, it sets the `cwd` based on the compiled root file,
 * possibly a sub-file. If in such a case, the compile command is `latexmk`, the
 * `cwd` is re-set to the root dir instead of sub-file. If the step is external,
 * it sets the `cwd` based on the provided `cwd` property.
 *
 * @param {Step} step - The Step to be executed.
 * @returns {ProcessEnv} - The process environment passed to the spawned
 * process.
 */
function spawnProcess(step) {
    const configuration = vscode.workspace.getConfiguration('latex-workshop', step.rootFile ? lw_1.lw.file.toUri(step.rootFile) : undefined);
    if (step.index === 0 || configuration.get('latex.build.clearLog.everyRecipeStep.enabled')) {
        logger.clearCompilerMessage();
    }
    logger.refreshStatus('sync~spin', 'statusBar.foreground', undefined, undefined, ' ' + queue_1.queue.getStepString(step));
    logger.logCommand(`Recipe step ${step.index + 1}`, step.command, step.args);
    logger.log(`env: ${JSON.stringify(step.env)}`);
    logger.log(`root: ${step.rootFile}`);
    const env = { ...process.env, ...step.env };
    env['max_print_line'] = lw_1.lw.constant.MAX_PRINT_LINE;
    if (!step.isExternal &&
        (step.name.startsWith(lw_1.lw.constant.TEX_MAGIC_PROGRAM_NAME) ||
            step.name.startsWith(lw_1.lw.constant.BIB_MAGIC_PROGRAM_NAME))) {
        logger.log(`cwd: ${path.dirname(step.rootFile)}`);
        const args = step.args;
        if (args && !step.name.endsWith(lw_1.lw.constant.MAGIC_PROGRAM_ARGS_SUFFIX)) {
            // All optional arguments are given as a unique string (% !TeX options) if any, so we use {shell: true}
            lw_1.lw.compile.process = lw_1.lw.external.spawn(`${step.command} ${args[0]}`, [], { cwd: path.dirname(step.rootFile), env, shell: true });
        }
        else {
            lw_1.lw.compile.process = lw_1.lw.external.spawn(step.command, args ?? [], { cwd: path.dirname(step.rootFile), env });
        }
    }
    else if (!step.isExternal) {
        let cwd = path.dirname(step.rootFile);
        if (step.command === 'latexmk' && step.rootFile === lw_1.lw.root.subfiles.path && lw_1.lw.root.dir.path) {
            cwd = lw_1.lw.root.dir.path;
        }
        logger.log(`cwd: ${cwd}`);
        lw_1.lw.compile.process = lw_1.lw.external.spawn(step.command, step.args ?? [], { cwd, env });
    }
    else {
        logger.log(`cwd: ${step.cwd}`);
        lw_1.lw.compile.process = lw_1.lw.external.spawn(step.command, step.args ?? [], { cwd: step.cwd });
    }
    logger.log(`LaTeX build process spawned with PID ${lw_1.lw.compile.process.pid}.`);
    return env;
}
/**
 * Monitors the output and termination of the tool process. This function
 * monitors the stdout and stderr channels to log and parse the output messages.
 * It also waits for the error or exit signal of the process. If the build is
 * unsuccessful, the function handles different cases and takes appropriate
 * actions.
 *
 * @param {Step} step - The Step of the process whose I/O is monitored.
 * @param {ProcessEnv} env - The process environment passed to the spawned
 * process.
 * @returns {Promise<boolean>} - A promise representing whether the step is
 * successfully executed.
 */
async function monitorProcess(step, env) {
    if (lw_1.lw.compile.process === undefined) {
        return false;
    }
    let stdout = '';
    lw_1.lw.compile.process.stdout?.on('data', (msg) => {
        stdout += msg;
        logger.logCompiler(msg.toString());
    });
    let stderr = '';
    lw_1.lw.compile.process.stderr?.on('data', (msg) => {
        stderr += msg;
        logger.logCompiler(msg.toString());
    });
    const result = await new Promise(resolve => {
        if (lw_1.lw.compile.process === undefined) {
            resolve(false);
            return;
        }
        lw_1.lw.compile.process.on('error', err => {
            handleProcessError(env, stderr, err);
            resolve(false);
        });
        lw_1.lw.compile.process.on('exit', (code, signal) => {
            const isSkipped = lw_1.lw.parser.parse.log(stdout, step.rootFile);
            if (!step.isExternal) {
                step.isSkipped = isSkipped;
            }
            if (!step.isExternal && code === 0) {
                logger.log(`Finished a step in recipe with PID ${lw_1.lw.compile.process?.pid}.`);
                lw_1.lw.compile.process = undefined;
                resolve(true);
                return;
            }
            else if (code === 0) {
                logger.log(`Successfully built document with PID ${lw_1.lw.compile.process?.pid}.`);
                logger.refreshStatus('check', 'statusBar.foreground', 'Build succeeded.');
                lw_1.lw.compile.process = undefined;
                resolve(true);
                return;
            }
            handleExitCodeError(step, env, stderr, code, signal);
            resolve(false);
        });
    });
    return result;
}
/**
 * Handles errors that occur during the execution of a tool process. This
 * function logs the error, refreshes the status, and shows an error message
 * to the user.
 *
 * @param {ProcessEnv} env - The process environment passed to the spawned
 * process.
 * @param {string} stderr - The stderr output of the process.
 * @param {Error} err - The error object representing the error.
 */
function handleProcessError(env, stderr, err) {
    logger.logError(`LaTeX fatal error on PID ${lw_1.lw.compile.process?.pid}.`, err);
    logger.log(`Does the executable exist? $PATH: ${env['PATH']}, $Path: ${env['Path']}, $SHELL: ${process.env.SHELL}`);
    logger.log(`${stderr}`);
    logger.refreshStatus('x', 'errorForeground', undefined, 'error');
    void logger.showErrorMessageWithExtensionLogButton(`Recipe terminated with fatal error: ${err.message}.`);
    lw_1.lw.compile.process = undefined;
    queue_1.queue.clear();
}
/**
 * Handles errors that occur when a tool process exits with a non-zero code or
 * signal. The function takes different actions based on the type of error,
 * such as handling retries, cleaning, and showing error messages to the user.
 *
 * @param {Step} step - The Step of the process that exited with an error.
 * @param {ProcessEnv} env - The process environment passed to the spawned
 * process.
 * @param {string} stderr - The stderr output of the process.
 * @param {number | null} code - The exit code of the process.
 * @param {NodeJS.Signals | null} signal - The exit signal of the process.
 */
function handleExitCodeError(step, env, stderr, code, signal) {
    if (!step.isExternal) {
        logger.log(`Recipe returns with error code ${code}/${signal} on PID ${lw_1.lw.compile.process?.pid}.`);
        logger.log(`Does the executable exist? $PATH: ${env['PATH']}, $Path: ${env['Path']}, $SHELL: ${process.env.SHELL}`);
        logger.log(`${stderr}`);
    }
    const configuration = vscode.workspace.getConfiguration('latex-workshop', step.rootFile ? lw_1.lw.file.toUri(step.rootFile) : undefined);
    if (!step.isExternal && signal !== 'SIGTERM' && !step.isRetry && configuration.get('latex.autoBuild.cleanAndRetry.enabled')) {
        handleRetryError(step);
    }
    else if (!step.isExternal && signal !== 'SIGTERM') {
        handleNoRetryError(configuration, step);
    }
    else if (step.isExternal) {
        handleExternalCommandError();
    }
    else {
        handleUserTermination();
    }
    lw_1.lw.compile.process = undefined;
}
/**
 * Handles the case where a tool process encounters an error and retries the
 * build process by creating a new Tool and adding it to the BuildToolQueue.
 *
 * @param {RecipeStep} step - The Step representing the tool process.
 */
function handleRetryError(step) {
    step.isRetry = true;
    logger.refreshStatus('x', 'errorForeground', 'Recipe terminated with error. Retry building the project.', 'warning');
    logger.log('Cleaning auxiliary files and retrying build after toolchain error.');
    queue_1.queue.prepend(step);
    void lw_1.lw.extra.clean(step.rootFile).then(() => lw_1.lw.event.fire(lw_1.lw.event.AutoCleaned));
}
/**
 * Handles the case where a tool process exits with an error and no retries are
 * allowed. It performs cleanup operations, shows error messages to the user,
 * and clears the BuildToolQueue.
 *
 * @param {vscode.WorkspaceConfiguration} configuration - The configuration for
 * the LaTeX project.
 * @param {RecipeStep} step - The Step representing the tool process.
 */
function handleNoRetryError(configuration, step) {
    logger.refreshStatus('x', 'errorForeground');
    if (['onFailed', 'onBuilt'].includes(configuration.get('latex.autoClean.run'))) {
        void lw_1.lw.extra.clean(step.rootFile).then(() => lw_1.lw.event.fire(lw_1.lw.event.AutoCleaned));
    }
    void logger.showErrorMessageWithCompilerLogButton('Recipe terminated with error.');
    queue_1.queue.clear();
}
/**
 * Handles the case where an external command process exits with an error. It
 * shows an error message to the user and clears the BuildToolQueue.
 */
function handleExternalCommandError() {
    logger.log(`Build with external command returns error on PID ${lw_1.lw.compile.process?.pid}.`);
    logger.refreshStatus('x', 'errorForeground', undefined, 'warning');
    void logger.showErrorMessageWithCompilerLogButton('Build terminated with error.');
    queue_1.queue.clear();
}
/**
 * Handles the case where a tool process is terminated by the user. It refreshes
 * the status and clears the BuildToolQueue.
 */
function handleUserTermination() {
    logger.refreshStatus('x', 'errorForeground');
    queue_1.queue.clear();
}
/**
 * Performs follow-up operations after successfully finishing a recipe. This
 * includes refreshing the PDF viewer, cleaning files, and handling SyncTeX if
 * configured.
 *
 * @param {Step} lastStep - The last Step in the recipe.
 * @param {boolean} skipped - Whether the whole building process is skipped by
 * latexmk.
 */
async function afterSuccessfulBuilt(lastStep, skipped) {
    if (lastStep.rootFile === undefined) {
        // This only happens when the step is an external command.
        lw_1.lw.viewer.refresh();
        return;
    }
    logger.log(`Successfully built ${lastStep.rootFile} .`);
    logger.refreshStatus('check', 'statusBar.foreground', 'Recipe succeeded.');
    lw_1.lw.event.fire(lw_1.lw.event.BuildDone);
    if (!lastStep.isExternal && skipped) {
        return;
    }
    lw_1.lw.viewer.refresh(lw_1.lw.file.toUri(lw_1.lw.file.getPdfPath(lastStep.rootFile)));
    lw_1.lw.completion.reference.setNumbersFromAuxFile(lastStep.rootFile);
    await lw_1.lw.cache.loadFlsFile(lastStep.rootFile ?? '');
    const configuration = vscode.workspace.getConfiguration('latex-workshop', lw_1.lw.file.toUri(lastStep.rootFile));
    // If the PDF viewer is internal, we call SyncTeX in src/components/viewer.ts.
    if (configuration.get('view.pdf.viewer') === 'external' && configuration.get('synctex.afterBuild.enabled')) {
        const pdfUri = lw_1.lw.file.toUri(lw_1.lw.file.getPdfPath(lastStep.rootFile));
        logger.log('SyncTex after build invoked.');
        lw_1.lw.locate.synctex.toPDF(pdfUri);
    }
    if (['onSucceeded', 'onBuilt'].includes(configuration.get('latex.autoClean.run'))) {
        logger.log('Auto Clean invoked.');
        await lw_1.lw.extra.clean(lastStep.rootFile);
        lw_1.lw.event.fire(lw_1.lw.event.AutoCleaned);
    }
}
//# sourceMappingURL=build.js.map