import request from '@/utils/request'
export const PlanOtherList = (query: any) => {
    return request({
        url: '/plan/other/fetch',
        method: 'get',
        params: query
    })
}
export const PlanOtherPushRow = (body: any) => {
    return request({
        url: '/plan/other/push',
        method: 'post',
        data: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        }
    })
}
