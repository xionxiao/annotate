import { fstat } from 'fs';
import * as vscode from 'vscode';
import * as utils from './utils';
const path = require('path');
const fs = require('fs');
const DEFUALT_PATH = '.vscode/.annotate';

export type NoteMap = {
    [filename: string]: NotePos
};

export type NotePos = {
    [position: string]: Note
};

export class AnnotateConfig {
    // root path to store notes, which is absolute path
    rootPath: string | undefined;
    notes: NoteMap = {};
    static instance: AnnotateConfig | undefined;

    static getInstance() {
        if (!AnnotateConfig.instance) {
            AnnotateConfig.instance = new AnnotateConfig();
        }
        return AnnotateConfig.instance;
    }

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
    // source file path, should be relative path
    readonly sourceFile: string;
    // range of source code
    readonly range: vscode.Range;
    // Note title or short description
    readonly title: string;
    // markdown note content
    note: vscode.MarkdownString | string | undefined;

    /**
     * Constuctor
     * @param sourceFile : source file path, should be relative path
     * @param from : selection start position
     * @param to : selection end postion
     */
    constructor(sourceFile: string, range: vscode.Range, title: string) {
        this.sourceFile = sourceFile;
        this.range = range;
        this.title = title;
    }

    /**
     * Display position from-to
     * @returns string e.g. L30:1-32:15, L30-32, L30 
     */
    toString(): string {
        return utils.rangeToString(this.range);
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
