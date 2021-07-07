import * as vscode from 'vscode';
import * as utils from './utils';


export class AnnotateConfig {
    // root Uri of all note
    static rootUri: vscode.Uri;
}

export class Note {
    // source file annotate to
    readonly sourceFile: vscode.Uri;
    // selection from
    readonly from: vscode.Position;
    // selection to
    readonly to: vscode.Position;
    // markdown note content
    note: vscode.MarkdownString | string | undefined;

    constructor(sourceFile: vscode.Uri, from: vscode.Position, to: vscode.Position) {
        this.sourceFile = sourceFile;
        this.from = from;
        this.to = to;
    }

    // Return postion from-to, 
    // e.g. L30:1-32:15, L30-32, L30
    toString() {
        let from = `L${this.from.line}${this.from ? ':' + this.from.character : ''}`;
        if (this.to) {
            return `${from}-${this.to.line}${this.to ? ':' + this.to.character : ''}`;
        } else {
            return from;
        }
    }

    toMarkdown() {
        let md = new vscode.MarkdownString(`##${this.toString()}\n`);
        if (this.note) {
            if (typeof this.note === 'string') {
                md.appendText(this.note);
            } else {
                md.appendMarkdown(this.note.value);
            }
        }
        return md;
    }
}
