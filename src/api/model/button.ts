import request from '@/utils/request'
export const flowButtonNewPush = (body: any) => {
    return request({
        url: '/flow/button/p',
        method: 'post',
        data: JSON.stringify(body),
        headers: {
            'Content-Type': 'text/plain'
        }
    })
}
export const flowPathNewPush = (body: any) => {
    return request({
        url: '/flow/path/p',
        method: 'post',
        data: JSON.stringify(body),
        headers: {
            'Content-Type': 'text/plain'
        }
    })
}
export const flowbtncheckNewPush = (body: any) => {
    return request({
        url: '/flow/btncheck/p',
        method: 'post',
        data: JSON.stringify(body),
        headers: {
            'Content-Type': 'text/plain'
        }
    })
}
export const flowbtnokNewPush = (body: any) => {
    return request({
        url: '/flow/btnok/p',
        method: 'post',
        data: JSON.stringify(body),
        headers: {
            'Content-Type': 'text/plain'
        }
    })
}
export const flowbtnactNewPush = (body: any) => {
    return request({
        url: '/flow/btnact/p',
        method: 'post',
        data: JSON.stringify(body),
        headers: {
            'Content-Type': 'text/plain'
        }
    })
}