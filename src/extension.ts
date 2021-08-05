import * as vscode from 'vscode';
import { NoteCodeLensProvider } from './NoteLens';
import { AnnotateConfig } from './note';
import { NotePos } from './note';
import * as utils from './utils';
import * as _ from 'lodash';
import { NotePanel } from './NotePanel';


export function activate(context: vscode.ExtensionContext) {
    console.log('extension "annotate" is now active!');
    // global configuration
    let gConfig = AnnotateConfig.getInstance();

    // reigister CodeLensProvider to show notes
    vscode.languages.registerCodeLensProvider('*', new NoteCodeLensProvider());

    const decorator = vscode.window.createTextEditorDecorationType({
        gutterIconPath: vscode.Uri.joinPath(context.extensionUri, "resource/images/note.svg"),
        gutterIconSize: "85%"
    });

    // open annotation webview
    createCommand(context, 'annotate.openAnnotation', async () => {
        console.log("execute annotate.openAnnotation");
        NotePanel.getInstance(context).show();
        /*
        let filename = getActiveFileRelativePath();
        if (filename) {
            let notes = gConfig.notes;
            if (!notes.hasOwnProperty(filename)) {
                console.log(`load notes`);
                // load notes from file
                notes[filename] = await loadNotes(filename);
            }
            console.log(`get notes : ${notes[filename]}`);
            // TODO: display notes
        } else {
            toast(`active document is null or unsaved!`);
        }
        */
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
        vscode.window.showInputBox({
            title: "Enter note title",
            // get first line as input suggestion
            value: text.split('\n')[0]
        }).then(title => {
            if (title) {
                // get file relative path
                let file = utils.getActiveFileRelativePath();
                gConfig.addNote(file, selection, title);
                let ranges = _.reduce(gConfig.notes[file], (r:vscode.Range[], v) => {
                    r.push(new vscode.Range(v.range.start, v.range.start));
                    return r;
                }, []);
                vscode.window.activeTextEditor?.setDecorations(
                    decorator,
                    ranges);
            }
        });
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
            return notes.reduce((n, r) => r[n.toString()] = n, {});
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
