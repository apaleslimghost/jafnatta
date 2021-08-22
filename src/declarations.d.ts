declare module 'redux-dynamic-middlewares' {
	import { Middleware } from "redux"

	class DynamicMiddlwares<T extends Middleware> {
		enhancer: T
		addMiddleware(mid: T): void
	}

	export function createDynamicMiddlewares<T extends Middleware>(): DynamicMiddlwares<T>
}

declare module 'react-redux/lib/alternate-renderers' {
	export * from 'react-redux'
}
