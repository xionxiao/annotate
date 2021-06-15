import * as vscode from 'vscode';

class Note {
    static noteUri: vscode.Uri;
    selection: vscode.Selection | undefined;
    note: vscode.MarkdownString | undefined;
}