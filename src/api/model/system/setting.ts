import request from '@/utils/request'
export const SettingMenuFetchList = (query: any) => {
    return request({
        url: '/system/setting/menu',
        method: 'get',
        params: query
    })
}
export const ApiSystemMenu = (query: any) => {
    return request({
        url: '/system/setting/getmenu',
        method: 'get',
        params: query
    })
}

