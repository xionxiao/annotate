import * as assert from "assert";
import { after } from 'mocha';

import * as vscode from 'vscode';
import { AnnotateConfig } from "../../note";
import { existFile } from "../../utils";

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
});
