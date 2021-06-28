import * as assert from "assert";

import { fileExist } from "../../utils";

suite("Utils Test", function () {
    test("File operation tests", async () => {
        let exist = await fileExist("nonExistFile");
        assert.strictEqual(false, exist);
    });
});