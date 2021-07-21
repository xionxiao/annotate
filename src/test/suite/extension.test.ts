import * as assert from "assert";
import { after } from 'mocha';

import * as vscode from 'vscode';
import { AnnotateConfig, Note } from "../../note";

// import * as myExtension from '../extension';

// Defines a Mocha test suite to group tests of similar kind together
suite("Extension Tests", function () {
    after(() => {
        vscode.window.showInformationMessage('All tests done!');
    });

    test("test load config", async () => {
        let config = new AnnotateConfig();
        config.loadConfigs();
        //let exist = await existFile(config.path);
        //assert.strictEqual(exist, false);
    });

    test("test loadNote", async () => {
        let note = new Note("source.js", new vscode.Position(12, 13), new vscode.Position(12, 16), "func");
        console.log(JSON.stringify(note));
    });
});
