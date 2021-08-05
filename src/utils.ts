import * as vscode from 'vscode';
import * as fs from 'fs';
import { TextEncoder } from 'util';
import { platform } from 'process';

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
 * Get relative path of active file
 * @returns relative path of active file
 */
 export function getActiveFileRelativePath(): string {
    // get current file path
    let editor = vscode.window.activeTextEditor;
    // current file path
    let filename = editor?.document.fileName || "";
    console.log(`file ${filename} `);
    let workspaceFolder = getCurrentWorkspaceFolder()?.fsPath;
    if (workspaceFolder) {
        filename = getRelativePath(filename!);
    } else {
        return "";
    }
    console.log(`relative file path : ${filename}`);
    return filename;
}


/**
 * is absolute path of Linux or windows
 * @param path file path
 * @returns true/false
 */
export function isAbsolute(path: string) {
    return /^\/|^[A-Za-z]:\\/.test(path);
}


/**
 * Convert absolute path to relative
 * @param path path to convert (absolute)
 * @param basePath base path (absolute), defaults to workspace path
 * @returns the relative path of basePath or empty string
 */
export function getRelativePath(path: string, basePath?: string) {
    let ends = (platform === 'win32' ? '\\' : '/');
    if (!basePath) {
        let workspace = getCurrentWorkspaceFolder();
        if (!workspace) {
            return '';
        }
        basePath = workspace.fsPath;
    }
    if (!basePath.endsWith(ends)) {
        basePath += ends;
    }
    let regex = new RegExp(`^${basePath}`);
    if (regex.test(path)) {
        return path.replace(regex, '');
    }
    return '';
}

/**
 * check if vscode has opened any workspace
 * @returns true / false
 */
export function hasWorkspace() {
    return vscode.workspace.workspaceFolders !== undefined;
}

/**
 * Convert Range to string representation
 * L35:15-L37:0
 * @param range 
 * @returns string representation
 */
export function rangeToString(range: vscode.Range): string {
    return `L${range.start.line}:${range.start.character}-${range.end.line}:${range.end.character}`;
}