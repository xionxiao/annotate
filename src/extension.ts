// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "annotate" is now active!');

	context.subscriptions.push(vscode.commands.registerCommand('annotate.openAnnotation', () => {
		vscode.window.showInformationMessage('Hello World from annotate!');
	}));
	context.subscriptions.push(vscode.commands.registerCommand('annotate.setAnnotationDir', () => {
		console.log("Set Annotation Directory");

	}));
}

// this method is called when your extension is deactivated
export function deactivate() { }
