import request from '@/utils/request'
export const ProjectIndexFetchList = (query: any) => {
    return request({
        url: '/projectindex/tree',
        method: 'get',
        params: query
    })
}
export const ProjectIndexPushRow = (body: any) => {
    return request({
        url: '/projectindex/push',
        method: 'post',
        data: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        }
    })
}