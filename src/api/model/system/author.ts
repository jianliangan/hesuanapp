import request from '@/utils/request'
export const SettingMenuFetchList = (query: any) => {
    return request({
        url: '/system/author/menu',
        method: 'get',
        params: query
    })
}
export const ApiSystemMenu = (query: any) => {
    return request({
        url: '/system/index/getmenu',
        method: 'get',
        params: query
    })
}

