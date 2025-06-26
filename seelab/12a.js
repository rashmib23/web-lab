const Stack = () => {
    let items = [];
    return {
        push: item => items.push(item),
        pop: () => items.pop(),
        print: () => console.log(items)
    };
};

const Queue = () => {
    let items = [];
    return {
        enqueue: item => items.push(item),
        dequeue: () => items.shift(),
        print: () => console.log(items)
    };
};

module.exports = { Stack, Queue };
