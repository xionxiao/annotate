import * as assert from "assert";
import { map } from "lodash";
import * as utils from "../../utils";

suite("Utils Test", function () {
    test("File operation tests", async () => {
        // test file not exist
        let exist = await utils.existFile("nonExistFile");
        assert.strictEqual(false, exist);
        // test file exist
        exist = await utils.existFile(__filename);
        assert.strictEqual(exist, true);
        // test dir exist
        exist = await utils.existFile(__dirname);
        // TODO: test on windows
    });

    test("isAbsolute path", () => {
        let absPath = [
            "C:\\windows",
            "D:\\",
            "/home/user"
        ];
        let notAbsPath = [
            ".annotate",
            "./annotate",
            "\\windows",
            "file://uri"
        ];
        map(absPath, p => {
            assert.strictEqual(utils.isAbsolute(p), true);
        });
        map(notAbsPath, p => {
            assert.strictEqual(utils.isAbsolute(p), false);
        });
    });
});