import request from '@/utils/request'
export const BudgetOtherList = (query: any) => {
    return request({
        url: '/budget/other/fetch',
        method: 'get',
        params: query
    })
}
export const BudgetOtherPushRow = (body: any) => {
    return request({
        url: '/budget/other/push',
        method: 'post',
        data: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        }
    })
}
