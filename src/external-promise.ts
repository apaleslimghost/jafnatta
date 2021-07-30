
// type MaybePromise<T> = T | ;
// type Resolve<T> = Promise<T> => void;
// type Reject = Error => void;

export default class ExternalPromise<T> extends Promise<T> {
	resolve(_: T | Promise<T>) {}
	reject(_: Error) {}
	label: string

	static create<T>(): ExternalPromise<T> {
		let resolve, reject;
		const out = new ExternalPromise<T>((s, j) => {
			resolve = s;
			reject = j;
		});

		out.resolve = resolve;
		out.reject = reject;
		return out;
	}
}
