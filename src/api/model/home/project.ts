import request from '@/utils/request'
export const ProjectFetchList = (query: any) => {
    return request({
        url: '/home/project/fetchwith/',
        method: 'get',
        params: query
    })
}
export const ProjectPushRow = (body: any) => {
    return request({
        url: '/home/project/push',
        method: 'post',
        data: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        }
    })
}
export const ProjectFetchTree = (query: any) => {
    return request({
        url: '/home/project/tree',
        method: 'get',
        params: query
    })
}