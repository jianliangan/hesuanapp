import request from "@/utils/request"

export const ApiToken = (query: any) => {
    return request({
        url: '/system/token',
        method: 'post',
        params: query
    })
}
export const ApiSystemMenu = (query: any) => {
    return request({
        url: '/system/menu',
        method: 'get',
        params: query
    })
}