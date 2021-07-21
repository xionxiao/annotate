import * as vscode from 'vscode';
import { AnnotateConfig } from './note';
import { Note } from './note';
import * as utils from './utils';

export function activate(context: vscode.ExtensionContext) {
    console.log('extension "annotate" is now active!');
    // global configuration
    let gConfig = new AnnotateConfig();
    gConfig.loadConfigs();
    // global NodeList map
    let gNoteMap: {
        [hash: string]: [Note] | []
    } = {};
    // global NodeList

    /**
     * open annotation panel
     * show annotations of current file
     */
    createCommand(context, 'annotate.openAnnotation', async () => {
        console.log("execute annotate.openAnnotation");
        console.log(`config ${JSON.stringify(gConfig)}`);
        // get current file path
        let editor = vscode.window.activeTextEditor;
        // current file path
        let filename = editor?.document.fileName;
        console.log(`file ${filename} `);
        if (filename && utils.isAbsolute(filename)) {
            if (gNoteMap.hasOwnProperty(filename)) {
                console.log(`get notes : ${gNoteMap[filename]}`);
                // display note
            } else {
                console.log(`can't get notes`);
                // load notes from file
                gNoteMap[filename] = [];
            }
        } else {
            toast(`active document is null or unsaved!`);
        }
        /*
        let root = utils.getCurrentWorkspaceFolder();
        console.log('workspace folder', root?.fsPath);

        let currentFile = editor?.document.fileName;
        if (vscode.workspace.workspaceFolders) {
            let path = vscode.workspace.workspaceFile;
            console.log(`workspaceFile: ${path}`);
            for (let i in vscode.workspace.workspaceFolders) {
                console.log(`${i} - ${vscode.workspace.workspaceFolders[i].uri.fsPath}`);
            }
        }
        console.log(`currentFile: ${currentFile}`);
        */
    });

    /**
     * add annotation to selections
     */
    createCommand(context, 'annotate.addAnnotation', async (args, thisArg) => {
        console.log("execute annotate.addAnnotation");
        let editor = vscode.window.activeTextEditor;
        // get selections, if not get current line
        let selection = editor?.selection;
        console.log(`selection: ${JSON.stringify(selection)}`);
        // get activate
        let active = editor?.selection.active;
        console.log(`active: ${JSON.stringify(active)}`);
        // get select text
        let text = editor?.document.getText(selection);
        console.log(`select text: ${text}`);
        // current file path
        let fsPath = editor?.document.uri.fsPath ?? "";
        console.log(`file path: ${fsPath}`);
        let root = utils.getCurrentWorkspaceFolder();
        console.log('workspace folder', root?.fsPath);
        let path = "";
        console.log(`path: ${path}`);
        if (path) {
            //await utils.openFile(path);
            let exist = await utils.existFile(path);
            if (exist) {
                console.log("file exist");
                vscode.window.showTextDocument(vscode.Uri.file(path), {
                    viewColumn: vscode.ViewColumn.Beside,
                    preview: false
                }).then(editor => {
                    console.log(`editor: ${JSON.stringify(editor)}`);
                    editor.edit((editBuilder) => {
                        editBuilder.insert(new vscode.Position(0, 0), `## ${JSON.stringify(selection)}`);
                    });
                });
            } else {
                console.log("file not exist");
                vscode.window.showTextDocument(vscode.Uri.file(path), {
                    viewColumn: vscode.ViewColumn.Beside,
                    preview: false
                }).then(value => {
                    console.log(`value: ${JSON.stringify(value)}`);
                });
            }
        }
    });
}

/**
 * shortcut of rigister a command
 * @param context : vscode context
 * @param cmd : command presentation
 * @param fn : command body: (args, thisArg) => { return vscode.Disposable }
 * @param thisArg : command context
 */
function createCommand(context: vscode.ExtensionContext, cmd: string, fn: (...args: any[]) => any, thisArg?: any) {
    context.subscriptions.push(vscode.commands.registerCommand(cmd, fn));
}

/**
 * Show toast in vscode right corner
 * @param content : content of toast
 */
function toast(content: string) {
    vscode.window.showInformationMessage(content);
}

// this method is called when your extension is deactivated
export function deactivate() { }
