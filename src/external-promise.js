//@flow

type Resolve<T> = (T | Promise<T>) => void;
type Reject = Error => void;

export default class ExternalPromise<T> extends Promise<T> {
	resolve: Resolve<T>;
	reject: Reject;

	constructor(resolver: (Resolve<T>, Reject) => void) {
		super(resolver);
	}

	static create<T>(): ExternalPromise<T> {
		let resolve, reject;
		const out = new ExternalPromise((s, j) => {
			resolve = s;
			reject = j;
		});

		return Object.assign(out, { resolve, reject });
	}
}