import * as vscode from 'vscode';


export class AnnotationPanel {
    /**
     * 
     */
    public static readonly viewType = "AnnotationPanel";
    public static instance: AnnotationPanel | undefined;

    private readonly panel: vscode.WebviewPanel;

    private constructor(context:vscode.ExtensionContext) {
        let title = vscode.window.activeTextEditor?.document.fileName
            ?? "New Annotation";
        this.panel = vscode.window.createWebviewPanel(
            AnnotationPanel.viewType,
            title,
            vscode.ViewColumn.Two,
            {
                enableScripts: true,
                localResourceRoots: [vscode.Uri.joinPath(context.extensionUri, "media")]
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

    public update() {
        if (this.panel) {
            this.panel.webview.html = AnnotationPanel.getHtml();
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

    private static getHtml() {
        const nonce = AnnotationPanel.getNonce();
        return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">

            <!--
                Use a content security policy to only allow loading images from https or from our extension directory,
                and only allow scripts that have a specific nonce.
            -->
            <meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'nonce-${nonce}';">

            <meta name="viewport" content="width=device-width, initial-scale=1.0">

            <link href="" rel="stylesheet">

            <title>New Annotation</title>
        </head>
        <body>
            <script nonce="${nonce}" src=""></script>
            <h1>New Annotation</h1>
        </body>
        </html>`;
    }
}