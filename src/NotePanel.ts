import * as vscode from 'vscode';
import * as utils from './utils';
import { NotePos } from './note';
import _ = require('lodash');

/**
 * WebView panel to display and edit Note
 */
export class NotePanel {
    // Name of panel: annotate.NotePanel
    public static readonly viewType = "NotePanel";
    // Singleton instance
    public static instance: NotePanel | undefined;

    private readonly panel: vscode.WebviewPanel;
    private readonly context: vscode.ExtensionContext;
    public readonly time: Date;

    /**
     * Constructor
     * @param context 
     */
    private constructor(context: vscode.ExtensionContext) {
        let title = "Annotation";
        this.time = new Date();
        this.context = context;
        this.panel = vscode.window.createWebviewPanel(
            NotePanel.viewType,
            title,
            vscode.ViewColumn.Two,
            {
                // allow javascript
                enableScripts: true,
                // allow access to resource folder
                localResourceRoots: [
                    vscode.Uri.joinPath(context.extensionUri, "resource"),
                ]
            }
        );
    }

    /**
     * Get NotePanel instance (Singleton)
     * @param context 
     * @returns 
     */
    public static getInstance(context: vscode.ExtensionContext) {
        if (NotePanel.instance) {
            return NotePanel.instance;
        } else {
            NotePanel.instance = new NotePanel(context);
            return NotePanel.instance;
        }
    }

    // Load resource
    private loadResource(folder: string, filename: string) {
        const onDiskUri = vscode.Uri.joinPath(this.context.extensionUri, folder, filename);
        return this.panel.webview.asWebviewUri(onDiskUri);
    }

    /**
     * Update NotePanel
     */
    public async update() {
        if (this.panel) {
            this.panel.webview.html = await this.getHtml();
        }
    }

    /**
     * Show NotePanel
     */
    public show() {
        if (this.panel) {
            this.update();
            this.panel.reveal();
        }
    }

    /**
     * Generate JS Nonce string for Content-Security-Policy
     * @returns 
     */
    private static getNonce() {
        let text = '';
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 32; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }

    /**
     * Load index.html template and render to html content
     * @returns 
     */
    private async getHtml() {
        let uri = vscode.Uri.joinPath(this.context.extensionUri, 'resource/html', 'index.html');
        try {
            let data = await utils.readFile(uri.path);
            const nonce = NotePanel.getNonce();
            const resource = this.loadResource("resource", "");
            const webview = this.panel.webview;
            const file = utils.getActiveFileRelativePath();
            let template = _.template(data);
            return template({
                'nonce': nonce,
                'webview': webview,
                'filename': file,
                'resource': resource
            });
        } catch (error) {
            console.log(error);
            return JSON.stringify(error);
        }
    }

    /**
     * Show Notes
     */
    public showNotes(notes: NotePos) {
        if (this.panel) {
            this.panel.webview.postMessage({
                command: 'AddNotes',
                content: notes
            });
        } else {
            // Error handling, show toast to user
            console.error('NotePanel not initialed');
        }
    }
}
