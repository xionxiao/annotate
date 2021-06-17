import * as vscode from 'vscode';

class Note {
    // root Uri of all note
    static noteRootUri: vscode.Uri;
    // selection from
    readonly from: vscode.Position;
    // selection to
    readonly to: vscode.Position;
    // source file annotate to
    readonly sourceFile: vscode.Uri;
    // markdown note content
    note: vscode.MarkdownString | undefined;

    constructor(sourceFile: vscode.Uri, from: vscode.Position, to: vscode.Position) {
        this.sourceFile = sourceFile;
        this.from = from;
        this.to = to;
    }
}