import request from '@/utils/request'
export const SupplyUnitList = (query: any) => {
    return request({
        url: '/dict/supplyunit/fetchwith',
        method: 'get',
        params: query
    })
}
export const SupplyUnitPushRow = (body: any) => {
    return request({
        url: '/dict/supplyunit/push',
        method: 'post',
        data: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        }
    })
}