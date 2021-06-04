// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { AnnotationPanel } from './AnnotationPanel';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "annotate" is now active!');
	const config: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration();

	/**
	 * open annotation panel
	 */
	createCommand(context, 'annotate.openAnnotation', () => {
		let panel = AnnotationPanel.getInstance(context);
		panel.show();
	});

	/**
	 * set annotation base directory
	 */
	createCommand(context, 'annotate.setAnnotationDir', () => {
		console.log('Annotate directory set!');
		let title = vscode.window.activeTextEditor?.document.fileName ?? "";
		messageBox(title);
	});

	/**
	 * add annotation to selections
	 */
	createCommand(context, 'annotate.addAnnotation', (args, thisArg) => {
		console.log('Add annotation', args, thisArg);
		let editor = vscode.window.activeTextEditor;
		let selection = editor?.selection;
		let text = editor?.document.getText(selection);
		vscode.window.showInformationMessage(
			`${selection?.start.line} : 
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
