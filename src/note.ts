import * as vscode from 'vscode';


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
}
