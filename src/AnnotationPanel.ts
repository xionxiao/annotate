import * as vscode from 'vscode';
import * as path from 'path';


export class AnnotationPanel {
    /**
     * 
     */
    public static readonly viewType = "AnnotationPanel";
    public static instance: AnnotationPanel | undefined;

    private readonly panel: vscode.WebviewPanel;
    private readonly extensionUri: vscode.Uri; 

    private constructor(context:vscode.ExtensionContext) {
        let title = vscode.window.activeTextEditor?.document.fileName
            ?? "New Annotation";
        this.extensionUri = context.extensionUri;
        this.panel = vscode.window.createWebviewPanel(
            AnnotationPanel.viewType,
            title,
            vscode.ViewColumn.Two,
            {
                enableScripts: true,
                localResourceRoots: [
                    vscode.Uri.joinPath(context.extensionUri, "media"),
                    vscode.Uri.joinPath(context.extensionUri, "css"),
                ]
            }
        );
    }

    public static getInstance(context:vscode.ExtensionContext) {
        if (AnnotationPanel.instance) {
            return AnnotationPanel.instance;
        } else {
            return new AnnotationPanel(context);
        }
    }

    private loadResource(folder:string, filename:string) {
        const onDiskUri = vscode.Uri.joinPath(this.extensionUri, folder, filename);
        console.log(onDiskUri);
        return this.panel.webview.asWebviewUri(onDiskUri);
    }

    public update() {
        if (this.panel) {
            this.panel.webview.html = this.getHtml();
        }
    }

    public show() {
        const column = vscode.window.activeTextEditor
            ? vscode.window.activeTextEditor.viewColumn
            : undefined;
        if (this.panel) {
            this.update();
            this.panel.reveal(column);
        }
    }

    public static getNonce() {
        let text = '';
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 32; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }

    private getHtml() {
        const nonce = AnnotationPanel.getNonce();
        const css = this.loadResource("css", "style.css");
        const webview = this.panel.webview;
        return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">

            <!--
                Use a content security policy to only allow loading images from https or from our extension directory,
                and only allow scripts that have a specific nonce.
            -->

            <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; img-src ${webview.cspSource} https:; script-src 'nonce-${nonce}';">

            <meta name="viewport" content="width=device-width, initial-scale=1.0">

            <link href="${css}" rel="stylesheet">

            <title>New Annotation</title>
        </head>
        <body>
            <script nonce="${nonce}" src=""></script>
            <h1>New Annotation</h1>
        </body>
        </html>`;
    }
}