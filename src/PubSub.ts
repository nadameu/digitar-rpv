export class PubSub<Msg = any> {
	private _subscribers: Array<(_: Msg) => void> = [];

	constructor() {}

	publish(message: Msg) {
		this._subscribers.forEach(sub => {
			sub(message);
		});
	}

	subscribe(subscriber: (_: Msg) => void): () => void {
		this._subscribers.push(subscriber);
		return () => {
			this._subscribers = this._subscribers.filter(sub => sub !== subscriber);
		};
	}
}
