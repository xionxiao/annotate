// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "annotate" is now active!');

	context.subscriptions.push(
		vscode.commands.registerCommand('annotate.openAnnotation', () => {
			const panel = vscode.window.createWebviewPanel(
				'Annotation',
				'Annotation Pannel',
				vscode.ViewColumn.Two,
				{
					enableScripts: true,
					localResourceRoots: [vscode.Uri.joinPath(context.extensionUri, 'media')]
				}
			);
			panel.webview.html = `<h1>Hello World</h1>`;
		})
	);
	context.subscriptions.push(
		vscode.commands.registerCommand('annotate.setAnnotationDir', () => {
			vscode.window.showInformationMessage('Annotate directory set!');
		})
	);
}

// this method is called when your extension is deactivated
export function deactivate() { }
