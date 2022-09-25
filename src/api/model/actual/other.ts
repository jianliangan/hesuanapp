import request from '@/utils/request'
export const ActualOtherList = (query: any) => {
    return request({
        url: '/actual/other/fetch',
        method: 'get',
        params: query
    })
}
export const ActualOtherPushRow = (body: any) => {
    return request({
        url: '/actual/other/push',
        method: 'post',
        data: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        }
    })
}
