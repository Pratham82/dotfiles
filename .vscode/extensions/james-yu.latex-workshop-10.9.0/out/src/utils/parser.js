"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.argContentToStr = argContentToStr;
function macroToStr(macro) {
    if (macro.content === 'texorpdfstring') {
        return macro.args?.[1].content[0]?.content || '';
    }
    return `\\${macro.content}` + (macro.args?.map(arg => `${arg.openMark}${argContentToStr(arg.content)}${arg.closeMark}`).join('') ?? '');
}
function envToStr(env) {
    return `\\environment{${env.env}}`;
}
function argContentToStr(argContent, preserveCurlyBrace = false) {
    return argContent.map(node => {
        // Verb
        switch (node.type) {
            case 'string':
                return node.content;
            case 'whitespace':
            case 'parbreak':
            case 'comment':
                return ' ';
            case 'macro':
                return macroToStr(node);
            case 'environment':
            case 'verbatim':
            case 'mathenv':
                return envToStr(node);
            case 'inlinemath':
                return `$${argContentToStr(node.content)}$`;
            case 'displaymath':
                return `\\[${argContentToStr(node.content)}\\]`;
            case 'group':
                return preserveCurlyBrace ? `{${argContentToStr(node.content)}}` : argContentToStr(node.content);
            case 'verb':
                return node.content;
            default:
                return '';
        }
    }).join('');
}
//# sourceMappingURL=parser.js.map