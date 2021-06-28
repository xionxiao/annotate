import * as assert from "assert";
import { LinkedList, Node } from "../../list";


suite("LinkedList Test", () => {
    test("Create", () => {
        let list = new LinkedList<number>();
        [0, 1, 2, 3].map( i => {
            list.add(new Node(i));
        });
        for(let i = 0; i<4; i++) {
            let j = list.get(i)?.data;
            assert(i === j);
        }
    });
});