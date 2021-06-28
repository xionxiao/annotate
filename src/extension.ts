// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { AnnotationPanel } from './AnnotationPanel';
import * as utils from './utils';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    console.log('Congratulations, your extension "annotate" is now active!');
    const config: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration();
    console.log(`rootDir: , ${config.get("annotate.rootDir")}`);
    console.log(`extensionPath: ${context.extensionPath}`);
    console.log(`extensionStoragePath: ${context.storageUri}`);

    console.log("onDidCloseTextDocument");
    context.subscriptions.push(vscode.workspace.onDidCloseTextDocument(e => console.log('onColse', e)));

    /**
     * open annotation panel
     * show annotations of current file
     */
    createCommand(context, 'annotate.openAnnotation', () => {
        let editor = vscode.window.activeTextEditor;
        let currentFile = editor?.document.fileName;
        if (vscode.workspace.workspaceFolders) {
            let path = vscode.workspace.workspaceFile;
            console.log(`workspaceFile: ${path}`);
            for (let i in vscode.workspace.workspaceFolders) {
                console.log(`${i} - ${vscode.workspace.workspaceFolders[i].uri.fsPath}`);
            }
        }
        console.log(`currentFile: ${currentFile}`);
        utils.getDefinitions();
    });

    /**
     * set annotation base directory
     */
    createCommand(context, 'annotate.setAnnotationDir', () => {
        console.log('Annotate directory set!');
        let title = vscode.window.activeTextEditor?.document.fileName ?? "";
        messageBox(title);
        /*
        const gitSCM = vscode.scm.createSourceControl('git', 'Git');
        console.log(gitSCM);
        vscode.commands.executeCommand('vscode.workspace.git.timeline.copyCommitId').then(res => {
            console.log(`git status ${res}`);
        });
        */
        vscode.languages.registerHoverProvider(
            '*',
            new (class implements vscode.HoverProvider {
                provideHover(
                    _document: vscode.TextDocument,
                    _position: vscode.Position,
                    _token: vscode.CancellationToken
                ): vscode.ProviderResult<vscode.Hover> {
                    /*
                    const commentCommandUri = vscode.Uri.parse("command:editor.action.addCommentLine");
                    console.log(commentCommandUri);
                    const content = new vscode.MarkdownString(`[Comment Line](${commentCommandUri})`);
                    */
                    const args = [{ resourceUri: _document.uri }];
                    const stageCommandUri = vscode.Uri.parse(
                        `command:git.log?${encodeURIComponent(JSON.stringify(args))}`
                    );
                    const content = new vscode.MarkdownString(`[Stage file](${stageCommandUri})`);
                    console.log(`content: ${JSON.stringify(content)} || ${stageCommandUri}`);
                    content.isTrusted = true;
                    return new vscode.Hover(content);
                }
            })()
        );
    });

    /**
     * add annotation to selections
     */
    createCommand(context, 'annotate.addAnnotation', async (args, thisArg) => {
        console.log('Add annotation', args, thisArg);
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
        let path = getNotePath();
        console.log(`path: ${path}`);
        if (path) {
            //await utils.openFile(path);
            let exist = await utils.fileExist(path);
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

    if (vscode.window.registerWebviewPanelSerializer) {
        vscode.window.registerWebviewPanelSerializer(AnnotationPanel.viewType, {
            async deserializeWebviewPanel(webviewPanel: vscode.WebviewPanel, state: any) {
                console.log(`Got state: ${state}`, webviewPanel);
                let panel = AnnotationPanel.getInstance(context);
                panel.show();
            }
        });
    }
}

function getNotePath() {
    let fsPath = vscode.window.activeTextEditor?.document.uri.fsPath;
    let rootPath = utils.getCurrentWorkspaceFolder()?.fsPath ?? '';
    let notePath = rootPath + '/.vscode/.annotation';
    let path = fsPath?.replace(rootPath, notePath) + '.md';
    return path;
}

function createCommand(context: vscode.ExtensionContext, cmd: string, fn: (...args: any[]) => any, thisArg?: any) {
    context.subscriptions.push(vscode.commands.registerCommand(cmd, fn));
}

function messageBox(content: string) {
    vscode.window.showInformationMessage(content);
}

// this method is called when your extension is deactivated
export function deactivate() { }
