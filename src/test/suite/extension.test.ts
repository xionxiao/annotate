import * as assert from "assert";
import { after } from 'mocha';

import * as vscode from 'vscode';
// import * as myExtension from '../extension';

// Defines a Mocha test suite to group tests of similar kind together
suite("Extension Tests", function () {
    after(() => {
        vscode.window.showInformationMessage('All tests done!');
    });

    test("Simple test 1", () => {
        assert.strictEqual(-1, [1, 2, 3].indexOf(5));
        assert.strictEqual(-1, [1, 2, 3].indexOf(0));
    });
});
