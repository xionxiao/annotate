// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { AnnotationPanel } from './AnnotationPanel';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "annotate" is now active!');

	/**
	 * open annotation panel
	 */
	context.subscriptions.push(
		vscode.commands.registerCommand('annotate.openAnnotation', () => {
			let panel = AnnotationPanel.getInstance(context);
			panel.show();
		})
	);

	/**
	 * set annotation base directory
	 */
	context.subscriptions.push(
		vscode.commands.registerCommand('annotate.setAnnotationDir', () => {
			console.log('Annotate directory set!');
			let title = vscode.window.activeTextEditor?.document.fileName ?? "";
			vscode.window.showInformationMessage(title);
		})
	);

	/**
	 * add annotation to selections
	 */
	context.subscriptions.push(
		vscode.commands.registerCommand('annotate.addAnnotation', () => {
			console.log('Add annotation');
			let selection = vscode.window.activeTextEditor?.selection;
			let text = vscode.window.activeTextEditor?.document.getText(selection);
			vscode.window.showInformationMessage(text ?? "");
		})
	);
}

// this method is called when your extension is deactivated
export function deactivate() { }
