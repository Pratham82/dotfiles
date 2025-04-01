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
exports.iconvLiteSupportedEncodings = void 0;
exports.convertFilenameEncoding = convertFilenameEncoding;
const fs = __importStar(require("fs"));
const iconv = __importStar(require("iconv-lite"));
// https://github.com/ashtuchkin/iconv-lite/wiki/Supported-Encodings
exports.iconvLiteSupportedEncodings = [
    'utf8', 'utf16le', 'UTF-16BE', 'UTF-16',
    'Shift_JIS', 'Windows-31j', 'Windows932', 'EUC-JP',
    'GB2312', 'GBK', 'GB18030', 'Windows936', 'EUC-CN',
    'KS_C_5601', 'Windows949', 'EUC-KR',
    'Big5', 'Big5-HKSCS', 'Windows950',
    'windows-874', 'windows-1250', 'windows-1251', 'windows-1252',
    'windows-1253', 'windows-1254', 'windows-1255', 'windows-1256',
    'windows-1257', 'windows-1258',
    'ISO-8859-1', 'ISO-8859-2', 'ISO-8859-3', 'ISO-8859-4', 'ISO-8859-5',
    'ISO-8859-6', 'ISO-8859-7', 'ISO-8859-8', 'ISO-8859-9', 'ISO-8859-10',
    'ISO-8859-11', 'ISO-8859-13', 'ISO-8859-14', 'ISO-8859-15', 'ISO-8859-16',
    'CP437', 'CP737', 'CP775',
    'CP850', 'CP852', 'CP855', 'CP856', 'CP857', 'CP858',
    'CP860', 'CP861', 'CP862', 'CP863', 'CP864', 'CP865', 'CP866', 'CP869',
    'CP922', 'CP1046', 'CP1124', 'CP1125', 'CP1129', 'CP1133', 'CP1161', 'CP1162', 'CP1163',
    'koi8-r', 'koi8-u', 'koi8-ru', 'koi8-t'
];
function convertFilenameEncoding(filePath) {
    for (const enc of exports.iconvLiteSupportedEncodings) {
        try {
            const fpath = iconv.decode(Buffer.from(filePath, 'binary'), enc);
            if (fs.existsSync(fpath)) {
                return fpath;
            }
        }
        catch (_) { }
    }
    return;
}
//# sourceMappingURL=convertfilename.js.map