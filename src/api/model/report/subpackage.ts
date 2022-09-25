import request from '@/utils/request'


export const ReportSubpackageTree = (query: any) => {
    return request({
        url: '/report/subpackage/tree2',
        method: 'get',
        params: query
    })
}
