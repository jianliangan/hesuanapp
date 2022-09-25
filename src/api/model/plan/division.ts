import request from '@/utils/request'
export const PlanDivisionList = (query: any) => {
    return request({
        url: '/plan/division/fetch',
        method: 'get',
        params: query
    })
}
export const PlanDivisionPushRow = (body: any) => {
    return request({
        url: '/plan/division/push',
        method: 'post',
        data: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

export const PlanDivisionTree = (query: any) => {
    return request({
        url: '/plan/division/tree2',
        method: 'get',
        params: query
    })
}
export const PlanDivisionMachineTree = (query: any) => {
    return request({
        url: '/plan/division/machine/tree',
        method: 'get',
        params: query
    })
}
export const PlanDivisionMachinePushRow = (body: any) => {
    return request({
        url: '/plan/division/machine/push',
        method: 'post',
        data: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        }
    })
}