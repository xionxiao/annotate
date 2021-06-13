import * as assert from "assert";
import { after } from 'mocha';

import * as vscode from 'vscode';
import { fileExist } from "../../utils";
// import * as myExtension from '../extension';

suite("Utils Test", function () {
    after(() => {
        vscode.window.showInformationMessage('Utils tests done!');
    });

    test("File operation tests", async () => {
        let exist = await fileExist("filename");
        assert.strictEqual(false, exist);
    });
});