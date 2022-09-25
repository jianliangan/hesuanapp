import request from '@/utils/request'


export const ReportProjectTree = (query: any) => {
    return request({
        url: '/report/project/tree2',
        method: 'get',
        params: query
    })
}
