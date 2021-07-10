import * as assert from "assert";

import { existFile } from "../../utils";

suite("Utils Test", function () {
    test("File operation tests", async () => {
        // test file not exist
        let exist = await existFile("nonExistFile");
        assert.strictEqual(false, exist);
        // test file exist
        exist = await existFile(__filename);
        assert.strictEqual(exist, true);
        // test dir exist
        exist = await existFile(__dirname);
    });
});