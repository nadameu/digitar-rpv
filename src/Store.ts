export class Store<S, A> {
	private _subscribers: Array<() => void> = [];
	constructor(
		private _state: S,
		private _reducer: (state: S, action: A) => S
	) {}

	get state() {
		return this._state;
	}

	dispatch(action: A) {
		const oldState = this._state;
		this._state = this._reducer(oldState, action);
		if (this._state !== oldState)
			this._subscribers.forEach(sub => {
				sub();
			});
	}

	subscribe(subscriber: () => void) {
		this._subscribers.push(subscriber);
		return () => {
			this._subscribers = this._subscribers.filter(sub => sub !== subscriber);
		};
	}
}
