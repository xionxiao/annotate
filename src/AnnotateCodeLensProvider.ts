import * as vscode from 'vscode';

export class AnnotateCodeLensProvider implements vscode.CodeLensProvider {
    constructor() {

    }

    provideCodeLenses(document: vscode.TextDocument, token: vscode.CancellationToken): vscode.ProviderResult<vscode.CodeLens[]> {
        throw new Error('Method not implemented.');
    }
}