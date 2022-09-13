import request from '@/utils/request'
export const BudgetMeasureList = (query: any) => {
    return request({
        url: '/budget/measure/fetch',
        method: 'get',
        params: query
    })
}
export const BudgetMeasurePushRow = (body: any) => {
    return request({
        url: '/budget/measure/push',
        method: 'post',
        data: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        }
    })
}
