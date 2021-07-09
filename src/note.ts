import * as vscode from 'vscode';

export class AnnotateConfig {
    // root path of note
    path!: string;

    // get configures from settings.json
    getConfigs() {
        const config = vscode.workspace.getConfiguration();
        this.path = config.get("annotate.path", "");
        console.log('annotate.path: ', this.path);
    }
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

    /**
     * Display position from-to
     * @returns string e.g. L30:1-32:15, L30-32, L30 
     */
    toString() {
        let from = `L${this.from.line}${this.from ? ':' + this.from.character : ''}`;
        if (this.to) {
            return `${from}-${this.to.line}${this.to ? ':' + this.to.character : ''}`;
        } else {
            return from;
        }
    }

    /**
     * Convert to MarkdownString
     * @returns {@link vscode.MarkdownString}
     */
    toMarkdown():vscode.MarkdownString {
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
