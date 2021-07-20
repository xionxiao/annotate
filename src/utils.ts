import * as vscode from 'vscode';
import * as fs from 'fs';
import { TextEncoder } from 'util';

export async function readFile(path: string): Promise<string> {
    return new Promise((resolve, reject) => {
        fs.readFile(path, { encoding: 'utf-8' }, (error, data) => {
            if (error) {
                reject(error);
            } else {
                resolve(data);
            }
        });
    });
}

export async function existFile(fsPath: string): Promise<boolean> {
    return new Promise(resolve => {
        fs.stat(fsPath, err => {
            if (err) {
                resolve(false);
            } else {
                resolve(true);
            }
        });
    });
}

export async function openFile(fsPath: string) {
    return vscode.commands.executeCommand(
        "vscode.open",
        vscode.Uri.file(fsPath),
        {
            viewColumn: vscode.ViewColumn.Beside,
            preview: false
        }
    );
}

export function writeFile(uri: vscode.Uri, content: string) {
    let enc = new TextEncoder();
    vscode.workspace.fs.writeFile(uri, enc.encode(content));
}

/**
 * Find definitions of current selection
 * @returns list of definitions
 */
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

/**
 * Get current workspace folder
 * @returns current workspace folder
 */
export function getCurrentWorkspaceFolder(): vscode.Uri | undefined {
    let editor = vscode.window.activeTextEditor;
    let uri = editor?.document.uri;
    if (uri) {
        return vscode.workspace.getWorkspaceFolder(uri)?.uri;
    }
    return undefined;
}


/**
 * is absolute path of Linux or windows
 * @param path file path
 * @returns true/false
 */
export function isAbsolute(path: string) {
    return /^\/|^[A-Za-z]:\\/.test(path);
}

export function getNotePath() {

}