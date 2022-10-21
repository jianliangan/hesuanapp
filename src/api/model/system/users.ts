import request from '@/utils/request'
export const UsersFetchList = (query: any) => {
    return request({
        url: '/system/users/fetch',
        method: 'get',
        params: query
    })
}
export const UsersPushRow = (body: any) => {
    return request({
        url: '/system/users/push',
        method: 'post',
        data: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        }
    })
}
export const ApiToken = (body: any) => {
  
    return request({
        url: '/system/users/token',
        method: 'post',
        data: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        }
    })
}
