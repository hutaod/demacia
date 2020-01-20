import React from 'react'
import { createStore } from '../store'
import { createAxios } from '../utils/axios'

const isServer = typeof window === 'undefined'
const __NEXT_REDUX_STORE__ = '__NEXT_REDUX_STORE__'

let $axios
if (isServer) {
	$axios = createAxios(
		{
			baseURL: 'https://extension-ms.juejin.im/',
		},
		isServer
	)
} else {
	$axios = createAxios({})
}

function getOrCreateStore(initialState) {
	// Always make a new store if server, otherwise state is shared between requests
	if (isServer) {
		return createStore({
			initialState,
			effectsExtraArgument: {
				$axios: $axios,
			},
		})
	}

	// Create store if unavailable on the client and set it on the window object
	if (!window[__NEXT_REDUX_STORE__]) {
		window[__NEXT_REDUX_STORE__] = createStore({
			initialState,
			effectsExtraArgument: {
				$axios: $axios,
			},
		})
	}
	return window[__NEXT_REDUX_STORE__]
}

export default App => {
	return class AppWithRedux extends React.Component {
		static async getInitialProps(appContext) {
			// Get or Create the store with `undefined` as initialState
			// This allows you to set a custom default initialState
			const reduxStore = getOrCreateStore()

			// Provide the store to getInitialProps of pages
			appContext.ctx.reduxStore = reduxStore

			let appProps = {}
			if (typeof App.getInitialProps === 'function') {
				appProps = await App.getInitialProps(appContext)
			}

			return {
				...appProps,
				initialReduxState: reduxStore.getState(),
			}
		}

		constructor(props) {
			super(props)
			this.reduxStore = getOrCreateStore(props.initialReduxState)
		}

		render() {
			return <App {...this.props} reduxStore={this.reduxStore} />
		}
	}
}
