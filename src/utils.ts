import * as vscode from 'vscode';
import * as fs from 'fs';

export async function readFileAsync(path: string): Promise<string> {
    return new Promise((resolve, reject) => {
        fs.readFile(path, { encoding: 'utf-8' }, (error, data) => {
            if (error) {
                reject(error);
            }
            resolve(data);
        });
    });
}


export function openFile(fsPath:string) {
    vscode.commands.executeCommand(
        "vscode.open",
        vscode.Uri.file(fsPath),
        {
          viewColumn: vscode.ViewColumn.Beside,
          preview: false
        }
      );
}


export async function getDefinitions() {
    const activeEditor = vscode.window.activeTextEditor;
    if (!activeEditor) {
        return;
    }

    const definitions = await vscode.commands.executeCommand<vscode.Location[]>(
        'vscode.executeDefinitionProvider',
        activeEditor.document.uri,
        activeEditor.selection.active
    );

    for (const definition of definitions!) {
        console.log(definition);
    }
    return definitions;
}