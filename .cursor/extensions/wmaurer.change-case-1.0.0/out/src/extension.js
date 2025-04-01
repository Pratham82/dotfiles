"use strict";
const vscode = require('vscode');
const change_case_commands_1 = require('./change-case-commands');
function activate(context) {
    vscode.commands.registerCommand('extension.changeCase.commands', change_case_commands_1.changeCaseCommands);
    vscode.commands.registerCommand('extension.changeCase.camel', () => { change_case_commands_1.runCommand(change_case_commands_1.COMMAND_LABELS.camel); });
    vscode.commands.registerCommand('extension.changeCase.constant', () => { change_case_commands_1.runCommand(change_case_commands_1.COMMAND_LABELS.constant); });
    vscode.commands.registerCommand('extension.changeCase.dot', () => { change_case_commands_1.runCommand(change_case_commands_1.COMMAND_LABELS.dot); });
    vscode.commands.registerCommand('extension.changeCase.kebab', () => { change_case_commands_1.runCommand(change_case_commands_1.COMMAND_LABELS.kebab); });
    vscode.commands.registerCommand('extension.changeCase.lower', () => { change_case_commands_1.runCommand(change_case_commands_1.COMMAND_LABELS.lower); });
    vscode.commands.registerCommand('extension.changeCase.lowerFirst', () => { change_case_commands_1.runCommand(change_case_commands_1.COMMAND_LABELS.lowerFirst); });
    vscode.commands.registerCommand('extension.changeCase.no', () => { change_case_commands_1.runCommand(change_case_commands_1.COMMAND_LABELS.no); });
    vscode.commands.registerCommand('extension.changeCase.param', () => { change_case_commands_1.runCommand(change_case_commands_1.COMMAND_LABELS.param); });
    vscode.commands.registerCommand('extension.changeCase.pascal', () => { change_case_commands_1.runCommand(change_case_commands_1.COMMAND_LABELS.pascal); });
    vscode.commands.registerCommand('extension.changeCase.path', () => { change_case_commands_1.runCommand(change_case_commands_1.COMMAND_LABELS.path); });
    vscode.commands.registerCommand('extension.changeCase.sentence', () => { change_case_commands_1.runCommand(change_case_commands_1.COMMAND_LABELS.sentence); });
    vscode.commands.registerCommand('extension.changeCase.snake', () => { change_case_commands_1.runCommand(change_case_commands_1.COMMAND_LABELS.snake); });
    vscode.commands.registerCommand('extension.changeCase.swap', () => { change_case_commands_1.runCommand(change_case_commands_1.COMMAND_LABELS.swap); });
    vscode.commands.registerCommand('extension.changeCase.title', () => { change_case_commands_1.runCommand(change_case_commands_1.COMMAND_LABELS.title); });
    vscode.commands.registerCommand('extension.changeCase.upper', () => { change_case_commands_1.runCommand(change_case_commands_1.COMMAND_LABELS.upper); });
    vscode.commands.registerCommand('extension.changeCase.upperFirst', () => { change_case_commands_1.runCommand(change_case_commands_1.COMMAND_LABELS.upperFirst); });
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map