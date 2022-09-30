import request from '@/utils/request'
export const RoleFetchList = (query: any) => {
    return request({
        url: '/system/role/fetch',
        method: 'get',
        params: query
    })
}
export const RolePushRow = (body: any) => {
    return request({
        url: '/system/role/push',
        method: 'post',
        data: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        }
    })
}
export const RolePushRowAuthor = (body: any, add: String) => {
    return request({
        url: '/system/role/pushauthor' + add,
        method: 'post',
        data: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        }
    })
}
