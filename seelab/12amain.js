const { Stack, Queue } = require('./12a');

const s = Stack();
s.push(10); s.push(20); s.print(); s.pop(); s.print();

const q = Queue();
q.enqueue("A"); q.enqueue("B"); q.print(); q.dequeue(); q.print();
