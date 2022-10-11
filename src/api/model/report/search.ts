import request from '@/utils/request'


export const ReportSearchList = (query: any) => {
    return request({
        url: '/report/search/fetch',
        method: 'get',
        params: query
    })
}
