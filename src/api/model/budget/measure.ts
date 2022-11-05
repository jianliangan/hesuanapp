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

export const BudgetMeasureTree = (query: any) => {
    return request({
        url: '/budget/measure/tree2',
        method: 'get',
        params: query
    })
}
export const BudgetMeasureMachineTree = (query: any) => {
    return request({
        url: '/budget/measure/machine/treewith',
        method: 'get',
        params: query
    })
}
export const BudgetMeasureMachinePushRow = (body: any) => {
    return request({
        url: '/budget/measure/machine/push',
        method: 'post',
        data: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        }
    })
}