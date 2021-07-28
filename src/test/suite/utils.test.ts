import * as assert from "assert";
import { map } from "lodash";
import * as utils from "../../utils";

suite("Utils Test", function () {
    test("==> test file operation", async () => {
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

    test("==> test isAbsolute path", () => {
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

    test("==> test getRelative path", () => {
        let testData = [
            ['/a/b/c', '/a/b/c/d/', 'd/'],
            ['/a/b/c/', '/a/b/c/d/e', 'd/e'],
            ['a/b/c', 'a/b/c/d/', 'd/'],
            ['/a/b/c', '/a/b/', '']
            // TODO: basePath is empty, test default workspace folder
        ];

        map(testData, d => {
            assert.strictEqual(utils.getRelativePath(d[1], d[0]), d[2]);
        });
    });
});