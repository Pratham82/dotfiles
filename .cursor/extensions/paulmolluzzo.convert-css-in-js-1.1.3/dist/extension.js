'use strict';

var _vscode = require('vscode');

var _vscode2 = _interopRequireDefault(_vscode);

var _cssInJsHelpers = require('./css-in-js-helpers');

var _cssInJsHelpers2 = _interopRequireDefault(_cssInJsHelpers);

var _autocomplete = require('./autocomplete');

var _autocomplete2 = _interopRequireDefault(_autocomplete);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function positionFactory(positionObj) {
  return new _vscode2.default.Position(positionObj._line, positionObj._character);
}

function rangeFactory(selection, length) {
  if (length === 0) {
    selection.start._character = 0;
    selection.end._character = _vscode2.default.window.activeTextEditor.document.lineAt(selection.start.line).text.length;
  }

  return new _vscode2.default.Range(positionFactory(selection.start), positionFactory(selection.end));
}

function activate(context) {
  var convertCommand = _vscode2.default.commands.registerCommand('extension.convertCSSinJS', function () {
    var editor = _vscode2.default.window.activeTextEditor;

    // return if there's no editor or it's not a javascript file
    if (!editor || !/javascript|typescript/.test(editor.document.languageId)) {
      return;
    }

    var selection = editor.selection;
    var lineText = editor.document.lineAt(selection.start.line).text;
    var selectedText = editor.document.getText(selection);
    var convertableText = selectedText || lineText;
    var range = rangeFactory(selection, selectedText.length);

    editor.edit(function (builder) {
      return builder.replace(range, (0, _cssInJsHelpers2.default)(convertableText));
    });
  });
  var codeCompletion = _vscode2.default.languages.registerCompletionItemProvider('javascript', {
    provideCompletionItems: function provideCompletionItems(document, position, token) {
      var start = new _vscode2.default.Position(position.line, 0);
      var range = new _vscode2.default.Range(start, position);
      var text = document.getText(range);

      if (_autocomplete2.default.isCompletingPseudoSelector(text)) {
        return _autocomplete2.default.getPseudoSelectorCompletions(text);
      }

      if (_autocomplete2.default.isCompletingValue(text)) {
        return _autocomplete2.default.getPropertyValueCompletions(text);
      }

      if (_autocomplete2.default.isCompletingName(text)) {
        return _autocomplete2.default.getPropertyNameCompletions(text);
      }
    },
    resolveCompletionItem: function resolveCompletionItem(item, token) {
      return item;
    }
  });

  context.subscriptions.push(convertCommand);
  context.subscriptions.push(codeCompletion);
}

module.exports = { activate: activate };