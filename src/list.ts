export class Node<T> {
    data: T;
    next: Node<T> | null;

    constructor(data: T, next?: Node<T>) {
        this.data = data;
        this.next = next || null;
    }
}

export class LinkedList<T> {
    private head: Node<T> | null = null;
    private tail: Node<T> | null = null;

    public add(node: Node<T>) {
        if (this.head === null) {
            this.head = node;
            this.tail = this.head;
        } else {
            if (this.tail === null) {
                throw new RangeError('Linked list tail is null');
            } else {
                this.tail.next = node;
                this.tail = node;
            }
        }
    }

    public get(i: number): Node<T> | null {
        if (this.head === null) {
            return null;
        }
        if (parseInt(i.toString()) !== i) {
            throw new RangeError(`Need integer index not ${i}`);
        }
        let p: Node<T> | null = this.head;
        let j: number = 0;
        while (p !== null) {
            if (i === j) {
                return p;
            }
            j++;
            p = p.next;
        }
        return null;
    }

    public insert(node: Node<T>, after: number | Node<T>): boolean {
        let fnode = typeof after === 'number' ? this.get(after) : after;
        if (fnode !== null) {
            fnode.next = node;
            if (fnode === this.tail) {
                this.tail = node;
            }
            return true;
        } else {
            return false;
        }
    }

    public clear() {
        this.head = null;
        this.tail = null;
    }
}