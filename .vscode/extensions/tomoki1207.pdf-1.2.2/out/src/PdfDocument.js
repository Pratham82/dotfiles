"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const disposable_1 = require("./utils/disposable");
class PdfDocument extends disposable_1.Disposable {
    constructor(uri) {
        super();
        this._uri = uri;
    }
    get uri() {
        return this._uri;
    }
}
exports.PdfDocument = PdfDocument;
//# sourceMappingURL=PdfDocument.js.map