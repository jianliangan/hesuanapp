import request from '@/utils/request'
export const MaterialsList = (query: any) => {
    return request({
        url: '/dict/materials/fetch',
        method: 'get',
        params: query
    })
}
export const MaterialsPushRow = (body: any) => {
    return request({
        url: '/dict/materials/push',
        method: 'post',
        data: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        }
    })
}