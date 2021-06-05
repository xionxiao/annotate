import * as vscode from 'vscode';
import { readFileAsync } from './utils';
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

    public async update() {
        if (this.panel) {
            this.panel.webview.html = await this.getHtml();
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

    private async getHtml() {
        let uri = vscode.Uri.joinPath(this.extensionUri, 'resource/html', 'index.html');
        try {
            let data = await readFileAsync(uri.path);
            const nonce = AnnotationPanel.getNonce();
            const cssUri = this.loadResource("resource/css", "style.css");
            const scriptUri = this.loadResource("resource/js", "main.js");
            const webview = this.panel.webview;
            let template = _.template(data);
            return template({
                'nonce': nonce,
                'cssUri': cssUri,
                'webview': webview,
                'scriptUri': scriptUri
            });
        } catch (error) {
            console.log(error);
            return JSON.stringify(error);
        }
    }
}