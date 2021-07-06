import * as assert from "assert";

import { existFile } from "../../utils";

suite("Utils Test", function () {
    test("File operation tests", async () => {
        let exist = await existFile("nonExistFile");
        assert.strictEqual(false, exist);
    });
});