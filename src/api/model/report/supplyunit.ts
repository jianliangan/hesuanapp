import request from '@/utils/request'


export const ReportSupplyUnitTree = (query: any) => {
    return request({
        url: '/report/supplyunit/tree2',
        method: 'get',
        params: query
    })
}
