import { fstat } from 'fs';
import * as vscode from 'vscode';
import * as utils from './utils';
const path = require('path');
const fs = require('fs');
const DEFUALT_PATH = '.vscode/.annotate';

export class AnnotateConfig {
    // root path to store notes, which is absolute path
    rootPath: string | undefined;

    // get configures from settings.json
    async loadConfigs() {
        const config = vscode.workspace.getConfiguration();
        this.rootPath = config.get('annotate.path', "");
        if (!this.rootPath) {
            this.rootPath = DEFUALT_PATH;
        }
        console.log('get annotate.path: ', this.rootPath);
        // path is not abstract path
        if (!utils.isAbsolute(this.rootPath)) {
            const folder = utils.getCurrentWorkspaceFolder();
            if (folder && folder.path) {
                this.rootPath = path.join(folder.path, this.rootPath);
            }
        }
        console.log('Config path: ', this.rootPath);
        // if path not exist, create path
        if (!await utils.existFile(this.rootPath!)) {
            console.log(`create path ${this.rootPath}`);
            // vscode.workspace.createDirectory(path).then();
            fs.mkdir(this.rootPath, { recursive: true }, (err: Error) => {
                if (err) {
                    console.log(`mkdir error: ${err}`);
                    this.rootPath = undefined;
                }
            });
        }
    }
}

export class Note {
    // source file annotate to
    readonly sourceFile: vscode.Uri;
    // selection from
    readonly from: vscode.Position;
    // selection to
    readonly to: vscode.Position;
    // markdown note content
    note: vscode.MarkdownString | string | undefined;

    constructor(sourceFile: vscode.Uri, from: vscode.Position, to: vscode.Position) {
        this.sourceFile = sourceFile;
        this.from = from;
        this.to = to;
    }

    /**
     * Display position from-to
     * @returns string e.g. L30:1-32:15, L30-32, L30 
     */
    toString() {
        let from = `L${this.from.line}${this.from ? ':' + this.from.character : ''}`;
        if (this.to) {
            return `${from}-${this.to.line}${this.to ? ':' + this.to.character : ''}`;
        } else {
            return from;
        }
    }

    /**
     * Convert to MarkdownString
     * @returns {@link vscode.MarkdownString}
     */
    toMarkdown(): vscode.MarkdownString {
        let md = new vscode.MarkdownString(`##${this.toString()}\n`);
        if (this.note) {
            if (typeof this.note === 'string') {
                md.appendText(this.note);
            } else {
                md.appendMarkdown(this.note.value);
            }
        }
        return md;
    }
}
