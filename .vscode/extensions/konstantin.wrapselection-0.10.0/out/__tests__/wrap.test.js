"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const wrap_1 = require("../wrap");
describe("wrap", () => {
    describe("should correctly wrap text", () => {
        it("should wrap with one character", () => {
            const wrappedText = wrap_1.default("test", ",");
            assert.equal(wrappedText, ",test,");
        });
        it("should wrap with multiple character", () => {
            const wrappedText = wrap_1.default("test", "--");
            assert.equal(wrappedText, "--test--");
        });
        describe("should wrap with correct predefined pattern", () => {
            it("should wrap with {}", () => {
                assert.equal(wrap_1.default("test", "}"), "{test}");
                assert.equal(wrap_1.default("test", "{"), "{test}");
            });
            it("should wrap with «»", () => {
                assert.equal(wrap_1.default("test", "»"), "«test»");
                assert.equal(wrap_1.default("test", "«"), "«test»");
            });
            it("should wrap with ()", () => {
                assert.equal(wrap_1.default("test", ")"), "(test)");
                assert.equal(wrap_1.default("test", "("), "(test)");
            });
            it("should wrap with []", () => {
                assert.equal(wrap_1.default("test", "]"), "[test]");
                assert.equal(wrap_1.default("test", "["), "[test]");
            });
            it("should wrap with <>", () => {
                assert.equal(wrap_1.default("test", ">"), "<test>");
                assert.equal(wrap_1.default("test", "<"), "<test>");
            });
        });
        describe("should wrap with more complex pattern", () => {
            it("should wrap with <!--", () => {
                assert.equal(wrap_1.default("test", "<!--"), "<!--test--!>");
                assert.equal(wrap_1.default("test", "--!>"), "<!--test--!>");
            });
            it("should wrap with {{}}", () => {
                assert.equal(wrap_1.default("test", "{{"), "{{test}}");
                assert.equal(wrap_1.default("test", "}}"), "{{test}}");
            });
            it("should wrap with {{{ }}}", () => {
                assert.equal(wrap_1.default("test", "{{{"), "{{{test}}}");
                assert.equal(wrap_1.default("test", "}}}"), "{{{test}}}");
            });
            it("should wrap with <%%>", () => {
                assert.equal(wrap_1.default("test", "<%"), "<%test%>");
                assert.equal(wrap_1.default("test", "%>"), "<%test%>");
            });
            it("should wrap with {%%}", () => {
                assert.equal(wrap_1.default("test", "{%"), "{%test%}");
                assert.equal(wrap_1.default("test", "%}"), "{%test%}");
            });
        });
    });
    describe("should correctly wrap with custom pattern", () => {
        it("wrap with log pattern", () => {
            const wrappedText = wrap_1.default("test", "log");
            assert.equal(wrappedText, "console.log(`test`, test)");
        });
        it("wrap with promise pattern", () => {
            const wrappedText = wrap_1.default("test", "promise");
            assert.equal(wrappedText, "new Promise((yeah, nah) => yeah(test))");
        });
    });
});
//# sourceMappingURL=wrap.test.js.map