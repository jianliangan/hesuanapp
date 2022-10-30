import request from '@/utils/request'
export const SubPackageList = (query: any) => {
    return request({
        url: '/dict/subpackage/fetchwith',
        method: 'get',
        params: query
    })
}
export const SupplyUnitList = (query: any) => {
    return request({
        url: '/dict/supplyunit/fetch',
        method: 'get',
        params: query
    })
}

export const SubPackagePushRow = (body: any) => {
    return request({
        url: '/dict/subpackage/push',
        method: 'post',
        data: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        }
    })
}