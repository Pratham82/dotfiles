"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var assert = require("assert");
var path = require("path");
var manager = require("./filepaths");
function getBuildedFilepath(oldName, newName, isFile, keep) {
    var oldPath = path.parse("/Users/name/Documents/" + oldName);
    return manager.buildFilepath(oldPath, { isFile: function () { return isFile; } }, /* tslint:disable-line no-any */ newName, { keepOriginalExtension: keep, openFileAfterCopy: false });
}
describe('Managers → Filepaths', function () {
    describe('.buildFilepath', function () {
        it('should build path to file', function () {
            var expected = '/Users/name/Documents/test.ts';
            var actual = getBuildedFilepath('test.js', 'test.ts', true, true);
            assert.equal(actual, expected);
        });
        it('should build path to directory', function () {
            var expected = '/Users/name/Documents/test-copy';
            var actual = getBuildedFilepath('test', 'test-copy', false, true);
            assert.equal(actual, expected);
        });
        it('should add original extension for new path of non-dot file', function () {
            var expected = '/Users/name/Documents/test.js';
            var actual = getBuildedFilepath('test.js', 'test', true, true);
            assert.equal(actual, expected);
        });
        it('should not add original extension for new path of non-dot file', function () {
            var expected = '/Users/name/Documents/test';
            var actual = getBuildedFilepath('test.js', 'test', false, true);
            assert.equal(actual, expected);
        });
        it('should add original extension for new path of dot file', function () {
            var expected = '/Users/name/Documents/.env.sample';
            var actual = getBuildedFilepath('.env.sample', '.env', true, true);
            assert.equal(actual, expected);
        });
        it('should not add original extension for new path of dot file', function () {
            var expected = '/Users/name/Documents/.env';
            var actual = getBuildedFilepath('.env.sample', '.env', true, false);
            assert.equal(actual, expected);
        });
        it('should not add original extension for new path of dot file with !!ext marker', function () {
            var expected = '/Users/name/Documents/.env';
            var actual = getBuildedFilepath('.env.sample', '.env!!ext', true, true);
            assert.equal(actual, expected);
        });
        it('should add original extension for new path of dot file with &&ext marker', function () {
            var expected = '/Users/name/Documents/.env.sample';
            var actual = getBuildedFilepath('.env.sample', '.env&&ext', true, false);
            assert.equal(actual, expected);
        });
    });
});
