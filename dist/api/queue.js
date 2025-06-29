/**
 * This is a custom stateless queue to track concurrent async fs calls.
 * It increments a counter whenever a call is queued and decrements it
 * as soon as it completes. When the counter hits 0, it calls onQueueEmpty.
 */
export class Queue {
    constructor(onQueueEmpty) {
        this.onQueueEmpty = onQueueEmpty;
        this.count = 0;
    }
    enqueue() {
        this.count++;
    }
    dequeue(error, output) {
        if (--this.count <= 0 || error)
            this.onQueueEmpty(error, output);
    }
}
