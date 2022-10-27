import request from '@/utils/request'
export const DictCategoryList = (query: any) => {
    return request({
        url: '/dict/dict/category/fetch',
        method: 'get',
        params: query
    })
}
export const DictCategoryPushRow = (body: any) => {
    return request({
        url: '/dict/dict/category/push',
        method: 'post',
        data: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        }
    })
}


export const DictSubjectList = (query: any) => {
    return request({
        url: '/dict/dict/subject/fetch',
        method: 'get',
        params: query
    })
}
export const DictSubjectPushRow = (body: any) => {
    return request({
        url: '/dict/dict/subject/push',
        method: 'post',
        data: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        }
    })
}


export const DictBillmodeList = (query: any) => {
    return request({
        url: '/dict/dict/billmode/fetch',
        method: 'get',
        params: query
    })
}
export const DictBillmodePushRow = (body: any) => {
    return request({
        url: '/dict/dict/billmode/push',
        method: 'post',
        data: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

export const DictSuppliertypeList = (query: any) => {
    return request({
        url: '/dict/dict/suppliertype/fetch',
        method: 'get',
        params: query
    })
}
export const DictSuppliertypePushRow = (body: any) => {
    return request({
        url: '/dict/dict/suppliertype/push',
        method: 'post',
        data: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        }
    })
}