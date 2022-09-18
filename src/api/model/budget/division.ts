import request from '@/utils/request'
export const BudgetDivisionList = (query: any) => {
    return request({
        url: '/budget/division/fetch',
        method: 'get',
        params: query
    })
}
export const BudgetDivisionPushRow = (body: any) => {
    return request({
        url: '/budget/division/push',
        method: 'post',
        data: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

export const BudgetDivisionTree = (query: any) => {
    return request({
        url: '/budget/tree2',
        method: 'get',
        params: query
    })
}