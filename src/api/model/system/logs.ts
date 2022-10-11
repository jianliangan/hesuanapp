import request from '@/utils/request'
export const LogsFetchList = (query: any) => {
    return request({
        url: '/system/logs/fetch',
        method: 'get',
        params: query
    })
}
