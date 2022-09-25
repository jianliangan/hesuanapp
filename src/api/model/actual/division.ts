import request from '@/utils/request'
export const ActualDivisionList = (query: any) => {
    return request({
        url: '/actual/division/fetch',
        method: 'get',
        params: query
    })
}
export const ActualDivisionPushRow = (body: any) => {
    return request({
        url: '/actual/division/push',
        method: 'post',
        data: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

export const ActualDivisionTree = (query: any) => {
    return request({
        url: '/actual/division/tree2',
        method: 'get',
        params: query
    })
}
export const ActualDivisionMachineTree = (query: any) => {
    return request({
        url: '/actual/division/machine/tree',
        method: 'get',
        params: query
    })
}
export const ActualDivisionMachinePushRow = (body: any) => {
    return request({
        url: '/actual/division/machine/push',
        method: 'post',
        data: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        }
    })
}