import request from '@/utils/request'
export const BusinessFetchList = (query: any) => {
    return request({
        url: '/sys/business/f',
        method: 'get',
        params: query
    })
}
export const BusinessPushRow = (body: any) => {
    return request({
        url: '/sys/business/p',
        method: 'post',
        data: JSON.stringify(body),
        headers: {
            'Content-Type': 'text/plain'
        }
    })
}

export const OrganizeFetchList = (query: any) => {
    return request({
        url: '/sys/organize/f',
        method: 'get',
        params: query
    })
}
export const OrganizePushRow = (body: any) => {
    return request({
        url: '/sys/organize/p',
        method: 'post',
        data: JSON.stringify(body),
        headers: {
            'Content-Type': 'text/plain'
        }
    })
}

//user
export const UserFetchList = (query: any) => {
    return request({
        url: '/sys/user/f',
        method: 'get',
        params: query
    })
}
//role
export const RoleFetchList = (query: any) => {
    return request({
        url: '/sys/role/f',
        method: 'get',
        params: query
    })
}
export const RolePushRow = (body: any) => {
    return request({
        url: '/sys/role/p',
        method: 'post',
        data: JSON.stringify(body),
        headers: {
            'Content-Type': 'text/plain'
        }
    })
}