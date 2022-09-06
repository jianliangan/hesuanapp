import request from '@/utils/request'
export const ConstructionFetchList = (query: any) => {
    return request({
        url: '/construction/fetch',
        method: 'get',
        params: query
    })
}
export const ConstructionPushRow = (body: any) => {
    return request({
        url: '/construction/push',
        method: 'post',
        data: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        }
    })
}