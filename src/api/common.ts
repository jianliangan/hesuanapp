import request from '@/utils/request'
export const FetchIds = () => {
    return request({
        url: '/this/global/getid',
        method: 'get'

    })
}