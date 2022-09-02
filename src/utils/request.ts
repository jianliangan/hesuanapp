import axios from 'axios'

import store from '@/store'
import config from '@/config/index'
import { getToken } from '@/utils/auth'
import { getCurrentInstance } from 'vue'
import { ElMessage } from 'element-plus'
import 'element-plus/theme-chalk/el-message.css'

// const cns = getCurrentInstance()


// if (cns != undefined)
//     myalert = cns.appContext.config.globalProperties.$alert
// else
//     myalert = {}
// create an axios instance

const service = axios.create({
    baseURL: config.API_URL, // url = base url + request url
    // withCredentials: true, // send cookies when cross-domain requests
    timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
    config => {
        // do something before request is sent

        if (store.getters.token) {
            // let each request carry token
            // ['X-Token'] is a custom headers key
            // please modify it according to the actual situation
            // config.headers['X-Token'] = getToken()
        }
        return config
    },
    error => {
        ElMessage.error('发生错误：' + error)

        return Promise.reject(error)
    }
)

// response interceptor
service.interceptors.response.use(
    /**
     * If you want to get http information such as headers or status
     * Please return  response => response
    */

    /**
     * Determine the request status by custom code
     * Here is just an example
     * You can also judge the status by HTTP Status Code
     */
    response => {


        if (response.status != 200) {
            ElMessage.error('http状态错误：')

        } else {
            if (response.data != undefined) {



                if (response.data["err"] != undefined) {
                    ElMessage.error('接口返回错误：' + response.data["err"])
                }
                return response
            }
        }
        //
        // alert("3333")
        // if the custom code is not 20000, it is judged as an error.

        return response
    },
    error => {
        ElMessage.error('网络错误：' + error)
        return Promise.reject(error)
    }
)

export default service
