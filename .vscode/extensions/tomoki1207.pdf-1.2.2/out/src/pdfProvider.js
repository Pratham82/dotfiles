"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const pdfPreview_1 = require("./pdfPreview");
class PdfCustomProvider {
    constructor(extensionRoot) {
        this.extensionRoot = extensionRoot;
        this._previews = new Set();
    }
    openCustomDocument(uri) {
        return { uri, dispose: () => { } };
    }
    resolveCustomEditor(document, webviewEditor) {
        return __awaiter(this, void 0, void 0, function* () {
            const preview = new pdfPreview_1.PdfPreview(this.extensionRoot, document.uri, webviewEditor);
            this._previews.add(preview);
            this.setActivePreview(preview);
            webviewEditor.onDidDispose(() => {
                preview.dispose();
                this._previews.delete(preview);
            });
            webviewEditor.onDidChangeViewState(() => {
                if (webviewEditor.active) {
                    this.setActivePreview(preview);
                }
                else if (this._activePreview === preview && !webviewEditor.active) {
                    this.setActivePreview(undefined);
                }
            });
        });
    }
    get activePreview() {
        return this._activePreview;
    }
    setActivePreview(value) {
        this._activePreview = value;
    }
}
exports.PdfCustomProvider = PdfCustomProvider;
PdfCustomProvider.viewType = 'pdf.preview';
//# sourceMappingURL=pdfProvider.js.map