import config from "./config"
import tool from '@/utils/tool'
//import api from './api'

export default {
    install(app: any) {
        //挂载全局对象
        app.config.globalProperties.$CONFIG = config;
        app.config.globalProperties.$TOOL = tool;

    }
}
