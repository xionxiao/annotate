import * as vscode from 'vscode';
import { AnnotateConfig } from './note';
import { Note } from './note';
import * as utils from './utils';

export function activate(context: vscode.ExtensionContext) {
    console.log('extension "annotate" is now active!');
    // global configuration
    let gConfig = AnnotateConfig.getInstance();
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
        let filename = getActiveFileRelativePath();
        if (filename) {
            if (!gNoteMap.hasOwnProperty(filename)) {
                console.log(`global notes not exist`);
                // load notes from file
                gNoteMap[filename] = await loadNotes(filename);
            }
            console.log(`get notes : ${gNoteMap[filename]}`);
            // TODO: display notes
        } else {
            toast(`active document is null or unsaved!`);
        }
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
 * Load notes from sourceFile
 * @param rootPath absolute path of notes folder
 * @param sourceFile relative file path of source file
 * @returns Note Array
 */
async function loadNotes(sourceFile: string): Promise<[Note] | []> {
    
    let config = AnnotateConfig.getInstance();
    let noteFile = config.rootPath + '/' + sourceFile + '.json';
    if (await utils.existFile(noteFile)) {
        let content = await utils.readFile(noteFile);
        let notes = <Note | [Note]>JSON.parse(content);
        if (Array.isArray(notes)) {
            return notes;
        } else {
            return [notes];
        }
    } else {
        return [];
    }
}

function getActiveFileRelativePath(): string {
    // get current file path
    let editor = vscode.window.activeTextEditor;
    // current file path
    let filename = editor?.document.fileName || "";
    console.log(`file ${filename} `);
    let workspaceFolder = utils.getCurrentWorkspaceFolder()?.fsPath;
    if (workspaceFolder) {
        filename = utils.getRelativePath(workspaceFolder, filename!);
    } else {
        return "";
    }
    console.log(`relative file path : ${filename}`);
    return filename;
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
