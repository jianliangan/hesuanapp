import request from '@/utils/request'
export const PlanMeasureList = (query: any) => {
    return request({
        url: '/plan/measure/fetch',
        method: 'get',
        params: query
    })
}
export const PlanMeasurePushRow = (body: any) => {
    return request({
        url: '/plan/measure/push',
        method: 'post',
        data: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

export const PlanMeasureTree = (query: any) => {
    return request({
        url: '/plan/measure/tree2',
        method: 'get',
        params: query
    })
}
export const PlanMeasureMachineTree = (query: any) => {
    return request({
        url: '/plan/measure/machine/tree',
        method: 'get',
        params: query
    })
}
export const PlanMeasureMachinePushRow = (body: any) => {
    return request({
        url: '/plan/measure/machine/push',
        method: 'post',
        data: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        }
    })
}