import request from '@/utils/request'
export const ProjectFetchList = (query: any) => {
    return request({
        url: '/project/fetch',
        method: 'get',
        params: query
    })
}
export const ProjectPushRow = (body: any) => {
    return request({
        url: '/project/push',
        method: 'post',
        data: JSON.stringify(body),
        headers: {
            'Content-Type': 'text/plain'
        }
    })
}