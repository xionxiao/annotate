import * as vscode from 'vscode';
import * as utils from './utils';
import { AnnotateConfig } from './note';


/**
 * Show CodeLens for a note
 */
export class NoteCodeLensProvider implements vscode.CodeLensProvider {
    provideCodeLenses(document: vscode.TextDocument, token: vscode.CancellationToken): vscode.ProviderResult<vscode.CodeLens[]> {
        let config = AnnotateConfig.getInstance();
        let fileName = utils.getRelativePath(document.fileName);
        if (config.notes && config.notes.hasOwnProperty(fileName)) {
            let codeLens: vscode.CodeLens[] = [];
            Object.values(config.notes[fileName]).map(n => {
                codeLens.push(new vscode.CodeLens(n.range, {
                    title: n.title,
                    command: "annotate.openAnnotation"
                }));
            });
            return codeLens;
        }
        return [];
    }

    public resolveCodeLens(codeLens: vscode.CodeLens, token: vscode.CancellationToken) {
        return null;
    }
}