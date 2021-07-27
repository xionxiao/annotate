import * as vscode from 'vscode';
import { AnnotateConfig } from './note';
import { Note } from './note';
import * as utils from './utils';

type NoteMap = {
    [filename: string]: NotePos
};

type NotePos = {
    [position: string]: Note
};

export function activate(context: vscode.ExtensionContext) {
    console.log('extension "annotate" is now active!');
    // global configuration
    let gConfig = AnnotateConfig.getInstance();
    // global NodeList map
    let gNoteMap: NoteMap = {};

    // open annotation
    createCommand(context, 'annotate.openAnnotation', async () => {
        console.log("execute annotate.openAnnotation");
        console.log(`config ${JSON.stringify(gConfig)}`);
        let filename = getActiveFileRelativePath();
        if (filename) {
            if (!gNoteMap.hasOwnProperty(filename)) {
                console.log(`load notes`);
                // load notes from file
                gNoteMap[filename] = await loadNotes(filename);
            }
            console.log(`get notes : ${gNoteMap[filename]}`);
            // TODO: display notes
        } else {
            toast(`active document is null or unsaved!`);
        }
    });

    // add annotation to selections
    createCommand(context, 'annotate.addAnnotation', async () => {
        console.log("execute annotate.addAnnotation");
        let editor = vscode.window.activeTextEditor;
        // get selections
        // selection always exist because set {"when": "editorHasSelection"}
        let selection = editor!.selection;
        console.log(`selection: ${JSON.stringify(selection)}`);
        let text = editor!.document.getText(selection);
        console.log(`select text: ${text}`);
        // get file relative path
        let file = getActiveFileRelativePath();
        let note = new Note(file, selection.start, selection.end, text);
        if (!gNoteMap.hasOwnProperty(file)) {
            gNoteMap[file] = {};
        }
        gNoteMap[file][note.toString()] = note;
    });
}

/**
 * Load notes from sourceFile
 * @param note path (relative)
 * @returns NotePos Array
 */
async function loadNotes(sourceFile: string): Promise<NotePos> {
    
    let config = AnnotateConfig.getInstance();
    let noteFile = config.rootPath + '/' + sourceFile + '.json';
    if (await utils.existFile(noteFile)) {
        let content = await utils.readFile(noteFile);
        let notes = JSON.parse(content);
        if (Array.isArray(notes)) {
            return notes.reduce((n,r) => r[n.toString()] = n, {});
        } else {
            const error = new Error("note file parse error!");
            toast(error.message);
            throw error;
        }
    } else {
        const error = new Error("note file not exist!");
        toast(error.message);
        throw error;
    }
}


/**
 * Get relative path of active file
 * @returns relative path of active file
 */
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
