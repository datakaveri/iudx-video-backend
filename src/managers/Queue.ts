import PQueue from 'p-queue';

const Queue = new PQueue({ concurrency: 4 });

let count = 0;
Queue.on('active', () => {
    console.log(`Working on item #${++count}.  Size: ${Queue.size}  Pending: ${Queue.pending}`);
});

export default Queue;
