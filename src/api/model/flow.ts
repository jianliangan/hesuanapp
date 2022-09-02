import request from '@/utils/request'
export class FieldUriParams {
	flow_id: string = "1"
}
export const FlowFetchList = (query: any) => {
	return request({
		url: '/flow/f',
		method: 'get',
		params: query
	})
}
export const FlowPushRow = (body: any) => {
	return request({
		url: '/flow/p',
		method: 'post',
		data: JSON.stringify(body),
		headers: {
			'Content-Type': 'text/plain'
		}
	})
}

/**
 * form 
 */
export const FlowFormFetch = (query: any) => {
	return request({
		url: '/flow/form/f',
		method: 'get',
		params: query
	})
}
//表单推送保存
export const FlowFormPush = (body: any) => {
	return request({
		url: '/flow/form/p',
		method: 'post',
		data: JSON.stringify(body),
		headers: {
			'Content-Type': 'text/plain'
		}
	})
}
export const flowFormFieldNewPush = (body: any) => {
	return request({
		url: '/flow/formfield/p',
		method: 'post',
		data: JSON.stringify(body),
		headers: {
			'Content-Type': 'text/plain'
		}
	})
}
//node edit
//节点相关信息推送保存

export const flowNodeNewPush = (body: any) => {
	return request({
		url: '/flow/node/p',
		method: 'post',
		data: JSON.stringify(body),
		headers: {
			'Content-Type': 'text/plain'
		}
	})
}
//节点修改前拉取列表
export const FlowNodeFetch = (query: any) => {
	return request({
		url: '/flow/node/f',
		method: 'get',
		params: query
	})
}

export const FlowNodeRowFetch = (query: any) => {
	return request({
		url: '/flow/noderow/f',
		method: 'get',
		params: query
	})
}