import * as vscode from 'vscode';
import * as fs from 'fs';
import { TextEncoder } from 'util';

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

export async function fileExist(fsPath:string): Promise<boolean> {
    try {
        const uri = vscode.Uri.file(fsPath);
        await vscode.workspace.fs.stat(uri);
        return true;
    } catch {
        return false;
    }
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

export function writeFile(uri: vscode.Uri, content:string) {
    let enc = new TextEncoder();
    vscode.workspace.fs.writeFile(uri, enc.encode(content));

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