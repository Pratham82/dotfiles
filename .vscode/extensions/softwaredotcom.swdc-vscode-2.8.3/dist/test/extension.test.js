"use strict";
//
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//
Object.defineProperty(exports, "__esModule", { value: true });
// The module 'assert' provides assertion methods from node
const assert = require("assert");
// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
const vscode = require("vscode");
// Defines a Mocha test suite to group tests of similar kind together
suite("Extension Tests", () => {
    // Defines a Mocha unit test
    test("Hello commands can be executed", async () => {
        await vscode.commands.executeCommand("extension.sayHello");
        assert(true);
    });
});
//# sourceMappingURL=extension.test.js.map