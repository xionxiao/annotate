// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { AnnotationPanel } from './AnnotationPanel';
import * as _ from 'lodash';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "annotate" is now active!');

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
		vscode.window.showInformationMessage(title);
	});

	/**
	 * add annotation to selections
	 */
	createCommand(context, 'annotate.addAnnotation', () => {
		console.log('Add annotation');
		let selection = vscode.window.activeTextEditor?.selection;
		let text = vscode.window.activeTextEditor?.document.getText(selection);
		vscode.window.showInformationMessage(text ?? "");
	});
}

function createCommand(context: vscode.ExtensionContext, cmd: string, fn: (...args: any[]) => any, thisArg?: any) {
	context.subscriptions.push(vscode.commands.registerCommand(cmd, fn));
}

// this method is called when your extension is deactivated
export function deactivate() { }
