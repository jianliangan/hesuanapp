import request from '@/utils/request'
export const ActualMeasureList = (query: any) => {
    return request({
        url: '/actual/measure/fetch',
        method: 'get',
        params: query
    })
}
export const ActualMeasurePushRow = (body: any) => {
    return request({
        url: '/actual/measure/push',
        method: 'post',
        data: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

export const ActualMeasureTree = (query: any) => {
    return request({
        url: '/actual/measure/tree2',
        method: 'get',
        params: query
    })
}
export const ActualMeasureMachineTree = (query: any) => {
    return request({
        url: '/actual/measure/machine/tree',
        method: 'get',
        params: query
    })
}
export const ActualMeasureMachinePushRow = (body: any) => {
    return request({
        url: '/actual/measure/machine/push',
        method: 'post',
        data: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        }
    })
}