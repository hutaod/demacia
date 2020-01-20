import axios from 'axios'

export default axios

export function createAxios(options = {}, isServer) {
	// 1. 创建axios实例
	const axiosInstance = axios.create({
		// baseURL: '/',
		// 请求超时时间
		timeout: 5000,
		headers: {
			'Content-Type': 'application/json;charset=UTF-8',
		},
		...options,
	})

	// 2. 请求拦截
	axiosInstance.interceptors.request.use(
		config => {
			// 服务端渲染时去除'/api'
			if (isServer && config.url && config.url.split('/api')[1]) {
				config.url = config.url.split('/api')[1]
			}
			return config
		},
		error => {
			// 请求错误预处理
			// console.log(error)
			return Promise.reject(error)
		}
	)

	// 3. 相应拦截
	axiosInstance.interceptors.response.use(
		response => {
			// 仅返回数据部分
			const res = response.data
			return res
		},
		error => {
			console.error(error)
			return Promise.reject(error)
		}
	)

	return {
		get: (url, data, others = {}) => {
			return axiosInstance({
				...others,
				url,
				method: 'GET',
				params: data,
				data: undefined,
			})
		},
		post: (url, data, others) => {
			return axiosInstance({
				...others,
				url,
				method: 'POST',
				data: data || {},
			})
		},
	}
}
