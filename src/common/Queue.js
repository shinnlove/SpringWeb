/**
 * FIFO QUEUE
 * 先进先出队列
 */
class Queue {

	constructor() {
		this.queue = new Array();
	}

	pop() {
		return this.queue.pop();
	}

	push(element) {
		this.queue.unshift(element);
	}

	length() {
		return this.queue.length;
	}

}

export default Queue;