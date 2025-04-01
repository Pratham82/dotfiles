"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.queue = void 0;
const vscode_1 = __importDefault(require("vscode"));
const lw_1 = require("../lw");
const stepQueue = { steps: [], nextSteps: [] };
/**
 * Add a Tool to the queue, either as a RecipeStep or ExternalStep, based on
 * isExternal flag. If the tool belongs to the same recipe (determined by
 * timestamp), it is added to the current steps; otherwise, it is added to the
 * next steps for later execution.
 *
 * @param {Tool} tool - The Tool to be added to the queue.
 * @param {string | undefined} rootFile - Path to the root LaTeX file.
 * @param {string} recipeName - The name of the recipe to which the tool
 * belongs.
 * @param {number} timestamp - The timestamp when the recipe is called.
 * @param {boolean} [isExternal=false] - Whether the tool is an external
 * command.
 * @param {string} [cwd] - The current working directory if the tool is an
 * external command.
 */
function add(tool, rootFile, recipeName, timestamp, isExternal = false, cwd) {
    // Wrap the tool as a RecipeStep or ExternalStep
    let step;
    if (!isExternal && rootFile !== undefined) {
        step = tool;
        step.rootFile = rootFile;
        step.recipeName = recipeName;
        step.timestamp = timestamp;
        step.isRetry = false;
        step.isExternal = false;
        step.isSkipped = false;
    }
    else {
        step = tool;
        step.recipeName = 'External';
        step.timestamp = timestamp;
        step.isExternal = true;
        step.cwd = cwd || '';
    }
    // Add the step to the appropriate queue (steps or nextSteps)
    if (stepQueue.steps.length === 0 || step.timestamp === stepQueue.steps[0].timestamp) {
        step.index = (stepQueue.steps[stepQueue.steps.length - 1]?.index ?? -1) + 1;
        stepQueue.steps.push(step);
    }
    else if (stepQueue.nextSteps.length === 0 || step.timestamp === stepQueue.nextSteps[0].timestamp) {
        step.index = (stepQueue.nextSteps[stepQueue.nextSteps.length - 1]?.index ?? -1) + 1;
        stepQueue.nextSteps.push(step);
    }
    else {
        step.index = 0;
        stepQueue.nextSteps = [step];
    }
}
/**
 * Add a step to the beginning of the current steps queue.
 *
 * @param {Step} step - The Step to be added to the front of the current steps
 * queue.
 */
function prepend(step) {
    stepQueue.steps.unshift(step);
}
/**
 * Clear both the current steps and next steps queues.
 */
function clear() {
    stepQueue.nextSteps.length = 0;
    stepQueue.steps.length = 0;
}
/**
 * Check if the given step is the last one in the current steps queue.
 *
 * @param {Step} step - The Step to check.
 * @returns {boolean} - True if the step is the last one; otherwise, false.
 */
function isLastStep(step) {
    return stepQueue.steps.length === 0 || stepQueue.steps[0].timestamp !== step.timestamp;
}
/**
 * Get a formatted string representation of the given step.
 *
 * @param {Step} step - The Step to get the string representation for.
 * @returns {string} - The formatted string representation of the step.
 */
function getStepString(step) {
    let stepString;
    // Determine the format of the stepString based on timestamp and index
    if (step.timestamp !== stepQueue.steps[0]?.timestamp && step.index === 0) {
        stepString = step.recipeName;
    }
    else if (step.timestamp === stepQueue.steps[0]?.timestamp) {
        stepString = `${step.recipeName}: ${step.index + 1}/${stepQueue.steps[stepQueue.steps.length - 1].index + 1} (${step.name})`;
    }
    else {
        stepString = `${step.recipeName}: ${step.index + 1}/${step.index + 1} (${step.name})`;
    }
    // Determine the format of the stepString based on timestamp and index
    if (step.rootFile) {
        const rootFileUri = lw_1.lw.file.toUri(step.rootFile);
        const configuration = vscode_1.default.workspace.getConfiguration('latex-workshop', rootFileUri);
        const showFilename = configuration.get('latex.build.rootfileInStatus', false);
        if (showFilename) {
            const relPath = vscode_1.default.workspace.asRelativePath(step.rootFile);
            stepString = `${relPath}: ${stepString}`;
        }
    }
    return stepString;
}
/**
 * Get the next step from the queue, either from the current steps or next
 * steps.
 *
 * @returns {Step | undefined} - The next step from the queue, or undefined if
 * the queue is empty.
 */
function getStep() {
    let step;
    if (stepQueue.steps.length > 0) {
        step = stepQueue.steps.shift();
    }
    else if (stepQueue.nextSteps.length > 0) {
        stepQueue.steps = stepQueue.nextSteps;
        stepQueue.nextSteps = [];
        step = stepQueue.steps.shift();
    }
    return step;
}
exports.queue = {
    add,
    prepend,
    clear,
    isLastStep,
    getStep,
    getStepString
};
//# sourceMappingURL=queue.js.map