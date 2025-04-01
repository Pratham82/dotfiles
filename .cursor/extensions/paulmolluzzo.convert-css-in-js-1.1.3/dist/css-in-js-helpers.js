'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.default = convert;
var CSS_COMPLETIONS = require('../completions-css.json');
var RN_COMPLETIONS = require('../completions-rn.json');

var getBeginningWhitespace = function getBeginningWhitespace(string) {
  return string.match(/^\s+/) !== null ? string.match(/^\s+/)[0] : '';
};

var isCSS = function isCSS(item) {
  return (item.match(/;/g) || []).length === 1;
};

var isJS = function isJS(item) {
  return (item.match(/,/g) || []).length === 1;
};

var toHyphen = function toHyphen(prop) {
  return prop.replace(/([A-Z])/g, function (char) {
    return '-' + char[0].toLowerCase();
  });
};

var toCamel = function toCamel(prop) {
  return prop.replace(/-(\w|$)/g, function (dash, next) {
    return next.toUpperCase();
  });
};

var toJS = function toJS(item) {
  var _item$split = item.split(':'),
      _item$split2 = _slicedToArray(_item$split, 2),
      prop = _item$split2[0],
      val = _item$split2[1];

  return '' + getBeginningWhitespace(prop) + toCamel(prop.trim()) + ': \'' + val.trim().replace(';', '') + '\',';
};

var toCSS = function toCSS(item) {
  var _item$split3 = item.split(':'),
      _item$split4 = _slicedToArray(_item$split3, 2),
      prop = _item$split4[0],
      val = _item$split4[1];

  return '' + getBeginningWhitespace(prop) + toHyphen(prop.trim()) + ': ' + val.trim().replace(/'|,/g, '') + ';';
};

var firstCharsEqual = function firstCharsEqual(str1, str2) {
  return str1[0].toLowerCase() === str2[0].toLowerCase();
};

var lineEndsWithComma = function lineEndsWithComma(text) {
  return (/,\s*$/.test(text)
  );
};

var isPropertyValuePrefix = function isPropertyValuePrefix(prefix) {
  return prefix.trim().length > 0 && prefix.trim() !== ':';
};

var firstInlinePropertyNameWithColonPattern = /(?:{{|{)\s*(\S+)\s*:/;

var inlinePropertyNameWithColonPattern = /(?:,.+?)*,\s*(\S+)\s*:/;

var inlinePropertyStartWithColonPattern = /(?::.+?)*,\s*/;

var propertyNameWithColonPattern = /^\s*(\S+)\s*:/;

var propertyNamePrefixPattern = /[a-zA-Z]+[-a-zA-Z]*$/;

var pseudoSelectorPrefixPattern = /\':(:)?([a-z]+[a-z-]*)?(\')?$/;

var tagSelectorPrefixPattern = /(^|\s|,)([a-z]+)?$/;

var importantPrefixPattern = /(![a-z]+)$/;

var cssDocsURL = 'https://developer.mozilla.org/en-US/docs/Web/CSS';

var rnDocsURL = 'https://facebook.github.io/react-native/docs';

function __guard__(value, transform) {
  return typeof value !== 'undefined' && value !== null ? transform(value) : undefined;
}

function isPropertyNamePrefix(prefix) {
  if (prefix == null) {
    return false;
  }
  prefix = prefix.trim();
  return prefix.length > 0 && prefix.match(/^[a-zA-Z-]+$/);
}

function getImportantPrefix(text) {
  return __guard__(importantPrefixPattern.exec(text), function (x) {
    return x[1];
  });
}

function convert(s) {
  var lines = s.split('\n');
  return lines.map(function (item) {
    return isCSS(item) ? toJS(item) : isJS(item) ? toCSS(item) : item;
  }).join('\n');
}

exports.CSS_COMPLETIONS = CSS_COMPLETIONS;
exports.RN_COMPLETIONS = RN_COMPLETIONS;
exports.firstCharsEqual = firstCharsEqual;
exports.lineEndsWithComma = lineEndsWithComma;
exports.isPropertyValuePrefix = isPropertyValuePrefix;
exports.firstInlinePropertyNameWithColonPattern = firstInlinePropertyNameWithColonPattern;
exports.inlinePropertyNameWithColonPattern = inlinePropertyNameWithColonPattern;
exports.inlinePropertyStartWithColonPattern = inlinePropertyStartWithColonPattern;
exports.propertyNameWithColonPattern = propertyNameWithColonPattern;
exports.propertyNamePrefixPattern = propertyNamePrefixPattern;
exports.pseudoSelectorPrefixPattern = pseudoSelectorPrefixPattern;
exports.tagSelectorPrefixPattern = tagSelectorPrefixPattern;
exports.importantPrefixPattern = importantPrefixPattern;
exports.cssDocsURL = cssDocsURL;
exports.rnDocsURL = rnDocsURL;
exports.__guard__ = __guard__;
exports.isPropertyNamePrefix = isPropertyNamePrefix;
exports.toHyphen = toHyphen;
exports.getImportantPrefix = getImportantPrefix;