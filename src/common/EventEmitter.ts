import { EventEmitter } from 'events';

const eventEmitter = new EventEmitter();

eventEmitter.on('error', err => console.log(err));

export default eventEmitter;
