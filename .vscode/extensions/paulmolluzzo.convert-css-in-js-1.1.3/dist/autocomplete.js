'use strict';

var _vscode = require('vscode');

var _vscode2 = _interopRequireDefault(_vscode);

var _cssInJsHelpers = require('./css-in-js-helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = {
  properties: _cssInJsHelpers.CSS_COMPLETIONS.properties,
  pseudoSelectors: _cssInJsHelpers.CSS_COMPLETIONS.pseudoSelectors,
  rnProperties: _cssInJsHelpers.RN_COMPLETIONS, // TODO: actually use this

  getPseudoSelectorPrefix: function getPseudoSelectorPrefix(text) {
    return (0, _cssInJsHelpers.__guard__)(text.match(_cssInJsHelpers.pseudoSelectorPrefixPattern), function (x) {
      return x[0];
    });
  },
  getPropertyNamePrefix: function getPropertyNamePrefix(text) {
    return (0, _cssInJsHelpers.__guard__)(_cssInJsHelpers.propertyNamePrefixPattern.exec(text), function (x) {
      return x[0];
    });
  },
  isCompletingPseudoSelector: function isCompletingPseudoSelector(text) {
    return this.getPseudoSelectorPrefix(text);
  },
  isCompletingValue: function isCompletingValue(text) {
    if (text.length - text.replace(/:/g, '').length === text.length - text.replace(/,/g, '').length) {
      return false;
    }
    return _cssInJsHelpers.inlinePropertyNameWithColonPattern.exec(text) || _cssInJsHelpers.firstInlinePropertyNameWithColonPattern.exec(text) || _cssInJsHelpers.propertyNameWithColonPattern.exec(text);
  },
  isCompletingName: function isCompletingName(text) {
    var prefix = this.getPropertyNamePrefix(text);
    return (0, _cssInJsHelpers.isPropertyNamePrefix)(prefix);
  },
  getPseudoSelectorCompletions: function getPseudoSelectorCompletions(text) {
    var completions = [];
    var prefix = this.getPseudoSelectorPrefix(text).replace("'", '');
    var colonsFromText = text.trim().match(/:?:/)[0] || '';

    if (!prefix) {
      return null;
    }

    for (var pseudoSelector in this.pseudoSelectors) {
      var options = this.pseudoSelectors[pseudoSelector];
      if ((0, _cssInJsHelpers.firstCharsEqual)(pseudoSelector, prefix)) {
        completions.push(this.buildPseudoSelectorCompletion(pseudoSelector, options, colonsFromText));
      }
    }

    return completions;
  },
  getPropertyValueCompletions: function getPropertyValueCompletions(text) {
    var prefix = this.getPropertyNamePrefix(text);
    var property = text.substr(0, text.lastIndexOf(':')).trim();
    var styles = this.properties;
    var values = styles[property] != null ? styles[property].values : undefined;

    if (values === null) {
      return null;
    }

    var addComma = !(0, _cssInJsHelpers.lineEndsWithComma)(text);
    var completions = [];
    var value = void 0;

    if ((0, _cssInJsHelpers.isPropertyValuePrefix)(prefix)) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = Array.from(values)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          value = _step.value;

          if ((0, _cssInJsHelpers.firstCharsEqual)(value, prefix)) {
            completions.push(this.buildPropertyValueCompletion(property, value, addComma));
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    } else {
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = Array.from(values)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          value = _step2.value;

          completions.push(this.buildPropertyValueCompletion(property, value, addComma));
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    }

    if ((0, _cssInJsHelpers.getImportantPrefix)(text)) {
      completions.push(this.vsCompletionItem('important', 'Forces this property to override any other declaration of the same property. Use with caution.', _cssInJsHelpers.cssDocsURL + '/Specificity#The_!important_exception'));
    }

    return completions;
  },
  getPropertyNameCompletions: function getPropertyNameCompletions(text) {
    var prefix = this.getPropertyNamePrefix(text);
    var completions = [];
    var styles = this.properties;
    for (var property in styles) {
      var options = styles[property];
      if (!prefix || (0, _cssInJsHelpers.firstCharsEqual)(property, prefix)) {
        completions.push(this.buildPropertyNameCompletion(property, options));
      }
    }
    return completions;
  },
  buildPseudoSelectorCompletion: function buildPseudoSelectorCompletion(pseudoSelector, _ref, colonsFromText) {
    var description = _ref.description;

    return this.vsCompletionItem(pseudoSelector, description, _cssInJsHelpers.cssDocsURL + '/' + pseudoSelector, pseudoSelector.replace(colonsFromText, ''));
  },
  buildPropertyNameCompletion: function buildPropertyNameCompletion(propertyName, _ref2) {
    var description = _ref2.description;

    return this.vsCompletionItem(propertyName, description, _cssInJsHelpers.cssDocsURL + '/' + (0, _cssInJsHelpers.toHyphen)(propertyName), propertyName + ': ');
  },
  buildPropertyValueCompletion: function buildPropertyValueCompletion(propertyName, value, addComma) {
    var text = '\'' + value + '\'' + (addComma ? ',' : '');
    var detail = value + ' value for the ' + propertyName + ' property';
    return this.vsCompletionItem(value, detail, _cssInJsHelpers.cssDocsURL + '/' + (0, _cssInJsHelpers.toHyphen)(propertyName) + '#Values', text, 'Value');
  },
  vsCompletionItem: function vsCompletionItem(text, detail) {
    var documentation = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
    var insertedText = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    var itemKind = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 'Property';

    var item = new _vscode2.default.CompletionItem(text, _vscode2.default.CompletionItemKind[itemKind]);
    item.detail = detail;
    item.documentation = documentation;
    item.insertText = insertedText;
    return item;
  }
};