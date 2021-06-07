// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { AnnotationPanel } from './AnnotationPanel';
import { getDefinitions } from './utils';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    console.log('Congratulations, your extension "annotate" is now active!');
    const config: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration();
    console.log(`rootDir: , ${config.get("annotate.rootDir")}`);
    console.log(`extensionPath: ${context.extensionPath}`);

    /**
     * open annotation panel
     */
    createCommand(context, 'annotate.openAnnotation', () => {
        /*
        let panel = AnnotationPanel.getInstance(context);
        panel.show();
        */
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
        getDefinitions();
    });

    /**
     * set annotation base directory
     */
    createCommand(context, 'annotate.setAnnotationDir', () => {
        console.log('Annotate directory set!');
        let title = vscode.window.activeTextEditor?.document.fileName ?? "";
        messageBox(title);
        vscode.languages.registerHoverProvider(
            '*',
            new (class implements vscode.HoverProvider {
                provideHover(
                    _document: vscode.TextDocument,
                    _position: vscode.Position,
                    _token: vscode.CancellationToken
                ): vscode.ProviderResult<vscode.Hover> {
                    const commentCommandUri = vscode.Uri.parse("command:editor.action.addCommentLine");
                    console.log(commentCommandUri);
                    const content = new vscode.MarkdownString(`[Comment Line](${commentCommandUri})`);
                    content.isTrusted = true;
                    return new vscode.Hover(content);
                }
            })()
        );
    });

    /**
     * add annotation to selections
     */
    createCommand(context, 'annotate.addAnnotation', (args, thisArg) => {
        console.log('Add annotation', args, thisArg);
        let editor = vscode.window.activeTextEditor;
        let selection = editor?.selection;
        let active = editor?.selection.active;
        let text = editor?.document.getText(selection);
        let fsPath = editor?.document.uri.fsPath ?? "";
        let root = vscode.workspace.getWorkspaceFolder(vscode.Uri.file(fsPath));
        console.log('root', root?.uri);
        messageBox(
            `${active} :
			${selection?.start.line} : 
			${selection?.start.character} : 
			${selection?.end.line} : 
			${selection?.end.character} => 
			${text}`);
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

function createCommand(context: vscode.ExtensionContext, cmd: string, fn: (...args: any[]) => any, thisArg?: any) {
    context.subscriptions.push(vscode.commands.registerCommand(cmd, fn));
}

function messageBox(content: string) {
    vscode.window.showInformationMessage(content);
}

// this method is called when your extension is deactivated
export function deactivate() { }
