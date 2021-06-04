import * as vscode from 'vscode';
import * as fs from 'fs';
import _ = require('lodash');


export class AnnotationPanel {
    /**
     * 
     */
    public static readonly viewType = "AnnoPanel";
    public static instance: AnnotationPanel | undefined;

    private readonly panel: vscode.WebviewPanel;
    private readonly extensionUri: vscode.Uri;
    public readonly time: Date;

    private constructor(context: vscode.ExtensionContext) {
        let title = vscode.window.activeTextEditor?.document.fileName
            ?? "New Annotation";
        this.time = new Date();
        this.extensionUri = context.extensionUri;
        this.panel = vscode.window.createWebviewPanel(
            AnnotationPanel.viewType,
            title,
            vscode.ViewColumn.Two,
            {
                enableScripts: true,
                localResourceRoots: [
                    vscode.Uri.joinPath(context.extensionUri, "resource"),
                ]
            }
        );
    }

    public static getInstance(context: vscode.ExtensionContext) {
        if (AnnotationPanel.instance) {
            return AnnotationPanel.instance;
        } else {
            AnnotationPanel.instance = new AnnotationPanel(context);
            return AnnotationPanel.instance;
        }
    }

    private loadResource(folder: string, filename: string) {
        const onDiskUri = vscode.Uri.joinPath(this.extensionUri, folder, filename);
        return this.panel.webview.asWebviewUri(onDiskUri);
    }

    public update() {
        if (this.panel) {
            this.panel.webview.html = this.getHtml();
        }
    }

    public show() {
        if (this.panel) {
            this.update();
            this.panel.reveal();
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
        let uri = vscode.Uri.joinPath(this.extensionUri, 'resource/html', 'index.html');
        let data = fs.readFileSync(uri.path, {encoding:'utf-8'});
        console.log(data.toString());
        const nonce = AnnotationPanel.getNonce();
        const cssUri = this.loadResource("resource/css", "style.css");
        const scriptUri = this.loadResource("resource/js", "main.js");
        const webview = this.panel.webview;
        let template = _.template(data.toString());
        let html = template({
            'nonce': nonce,
            'cssUri': cssUri,
            'webview': webview,
            'scriptUri': scriptUri
        });
        console.log(html);
        return html;
        /*
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

            <link href="${cssUri}" rel="stylesheet">
            
            <title>New Annotation</title>
        </head>
        <body>
            <h1>New Annotation</h1>
            <textarea></textarea>

            <script nonce="${nonce}" src="${scriptUri}"></script>
        </body>
        </html>`;
        */
    }
}