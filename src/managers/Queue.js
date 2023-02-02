"use strict";
exports.__esModule = true;
var p_queue_1 = require("p-queue");
var Queue = new p_queue_1["default"]({ concurrency: 4 });
var count = 0;
Queue.on('active', function () {
    console.log("Working on item #" + ++count + ".  Size: " + Queue.size + "  Pending: " + Queue.pending);
});
exports["default"] = Queue;
