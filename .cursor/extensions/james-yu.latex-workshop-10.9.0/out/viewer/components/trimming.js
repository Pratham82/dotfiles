let viewerTrim = 0;
globalThis.viewerTrim = 0;
export function getTrimValue() {
    return viewerTrim;
}
export function setTrimValue(trim) {
    viewerTrim = Math.min(100, Math.max(0, trim));
    globalThis.viewerTrim = viewerTrim;
    const select = document.getElementById('scaleSelect');
    if (select.value === 'custom') {
        PDFViewerApplication.pdfViewer.currentScaleValue = (JSON.parse(select.options[select.selectedIndex].getAttribute('data-l10n-args')).scale / 100).toString();
    }
    else {
        PDFViewerApplication.pdfViewer.currentScaleValue = select.value;
    }
    // Set the value again to avoid displaying decimals like 7.00
    const trimPct = document.getElementById('trimPct');
    trimPct.value = viewerTrim.toString();
}
export function initTrim() {
    document.getElementById('viewer').style.setProperty('--trim-factor', getTrimValue().toString());
    setTrimCSS();
    const trimPct = document.getElementById('trimPct');
    trimPct.onchange = _ => {
        viewerTrim = Number.parseFloat(trimPct.value);
        document.getElementById('viewer').style.setProperty('--trim-factor', viewerTrim.toString());
        setTrimValue(viewerTrim);
    };
}
export function setTrimCSS() {
    const css = document.styleSheets[document.styleSheets.length - 1];
    const prevCssCount = css.cssRules.length;
    // Add new rules
    for (const [pageNum, page] of PDFViewerApplication.pdfViewer._pages.entries()) {
        let { pageHeight, pageWidth } = page.viewport.rawDims;
        css.insertRule(getCanvasRule('textLayer', pageNum, pageHeight, pageWidth), css.cssRules.length);
        if ([90, 270].includes(page.viewport.rotation)) {
            [pageHeight, pageWidth] = [pageWidth, pageHeight];
        }
        css.insertRule(getPageRule(pageNum, pageHeight, pageWidth), css.cssRules.length);
        css.insertRule(getCanvasRule('canvasWrapper', pageNum, pageHeight, pageWidth), css.cssRules.length);
        css.insertRule(getCanvasRule('annotationLayer', pageNum, pageHeight, pageWidth), css.cssRules.length);
    }
    // Remove previous rules
    for (let index = prevCssCount - 1; index >= 0; index--) {
        const rule = css.cssRules[index];
        if ('selectorText' in rule && rule.selectorText.includes('.page[data-page-number=')) {
            css.deleteRule(index);
        }
    }
}
function getPageRule(pageNum, pageHeight, pageWidth) {
    return `
        .page[data-page-number="${pageNum + 1}"] {
            width: round(down, calc(var(--scale-factor) * ${pageWidth}px * (1 - var(--trim-factor) / 100)), 1px) !important;
            height: round(down, calc(var(--scale-factor) * ${pageHeight}px * (1 - var(--trim-factor) / 100)), 1px) !important;
        }`;
}
function getCanvasRule(className, pageNum, pageHeight, pageWidth) {
    return `
        .page[data-page-number="${pageNum + 1}"] .${className} {
            width: round(down, calc(var(--scale-factor) * ${pageWidth}px), 1px) !important;
            height: round(down, calc(var(--scale-factor) * ${pageHeight}px), 1px) !important;
            margin-left: round(down, calc(var(--scale-factor) * ${pageWidth}px * var(--trim-factor) / -200), 1px) !important;
            margin-top: round(down, calc(var(--scale-factor) * ${pageHeight}px * var(--trim-factor) / -200), 1px) !important;
        }`;
}
//# sourceMappingURL=trimming.js.map