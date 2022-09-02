/*
 * @Descripttion: 工具集
 * @version: 1.2
 * @LastEditors: sakuya
 * @LastEditTime: 2022年5月24日00:28:56
 */

import CryptoJS from 'crypto-js';
import sysConfig from "@/config";
interface keyable {
    [key: string]: any
}

const tool: keyable = {}
//{ data: {}, session: {}, cookie: {}, screen: {}, objCopy: {}, dateFormat: {}, groupSeparator: {}, crypto: keyable{ } }

/* localStorage */
tool.data = {
    set(key: any, data: any, datetime = 0) {
        //加密
        if (sysConfig.LS_ENCRYPTION == "AES") {
            data = tool.crypto["AES"].encrypt(JSON.stringify(data), sysConfig.LS_ENCRYPTION_key)
        }
        let cacheValue = {
            content: data,
            datetime: parseInt(String(datetime)) === 0 ? 0 : new Date().getTime() + parseInt(String(datetime)) * 1000
        }

        return localStorage.setItem(key, JSON.stringify(cacheValue))
    },
    get(key: string) {
        try {
            let keyitem = localStorage.getItem(key)
            if (keyitem === null)
                return null
            const value = JSON.parse(keyitem)

            if (value) {
                let nowTime = new Date().getTime()
                if (nowTime > value.datetime && value.datetime != 0) {
                    localStorage.removeItem(key)
                    return null;
                }
                //解密
                if (sysConfig.LS_ENCRYPTION == "AES") {
                    value.content = JSON.parse(tool.crypto.AES.decrypt(value.content, sysConfig.LS_ENCRYPTION_key))
                }
                return value.content
            }
            return null
        } catch (err) {
            return null
        }
    },
    remove(key: string) {
        return localStorage.removeItem(key)
    },
    clear() {
        return localStorage.clear()
    }
}

/*sessionStorage*/
tool.session = {
    set(table: string, settings: string) {
        var _set = JSON.stringify(settings)
        return sessionStorage.setItem(table, _set);
    },
    get(table: string) {
        var data = sessionStorage.getItem(table);
        try {
            if (data !== null)
                data = JSON.parse(data)
        } catch (err) {
            return null
        }
        return data;
    },
    remove(table: string) {
        return sessionStorage.removeItem(table);
    },
    clear() {
        return sessionStorage.clear();
    }
}

/*cookie*/
tool.cookie = {
    set(name: string, value: string, config = {}) {
        var cfg = {
            expires: null,
            path: null,
            domain: null,
            secure: false,
            httpOnly: false,
            ...config
        }
        var cookieStr = `${name}=${escape(value)}`
        if (cfg.expires) {
            var exp = new Date()
            exp.setTime(exp.getTime() + parseInt(cfg.expires) * 1000)
            cookieStr += `;expires=${exp.toUTCString()}`
        }
        if (cfg.path) {
            cookieStr += `;path=${cfg.path}`
        }
        if (cfg.domain) {
            cookieStr += `;domain=${cfg.domain}`
        }
        document.cookie = cookieStr
    },
    get(name: string) {
        var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"))
        if (arr != null) {
            return unescape(arr[2])
        } else {
            return null
        }
    },
    remove(name: string) {
        var exp = new Date()
        exp.setTime(exp.getTime() - 1)
        document.cookie = `${name}=;expires=${exp.toUTCString()}`
    }
}

/* Fullscreen */
interface Document {
    webkitIsFullScreen: () => void;
    mozFullScreen: () => void;
    msFullscreenElement: () => void;
    msExitFullscreen: () => void;
    mozCancelFullScreen: () => void;
    webkitExitFullscreen: () => void;
}
tool.screen = function (element: any) {
    var isFull = !!((document as unknown as Document).webkitIsFullScreen || (document as unknown as Document).mozFullScreen || (document as unknown as Document).msFullscreenElement || document.fullscreenElement);
    if (isFull) {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if ((document as unknown as Document).msExitFullscreen) {
            (document as unknown as Document).msExitFullscreen();
        } else if ((document as unknown as Document).mozCancelFullScreen) {
            (document as unknown as Document).mozCancelFullScreen();
        } else if ((document as unknown as Document).webkitExitFullscreen) {
            (document as unknown as Document).webkitExitFullscreen();
        }
    } else {
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        }
    }
}

/* 复制对象 */
tool.objCopy = function (obj: any) {
    return JSON.parse(JSON.stringify(obj));
}

/* 日期格式化 */
tool.dateFormat = function (date: Date, fmt = 'yyyy-MM-dd hh:mm:ss') {
    date = new Date(date)
    var o: keyable = {
        "M+": date.getMonth() + 1,                 //月份
        "d+": date.getDate(),                    //日
        "h+": date.getHours(),                   //小时
        "m+": date.getMinutes(),                 //分
        "s+": date.getSeconds(),                 //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        "S": date.getMilliseconds()             //毫秒
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}

/* 千分符 */
tool.groupSeparator = function (num: string) {
    num = num + '';
    if (!num.includes('.')) {
        num += '.'
    }
    return num.replace(/(\d)(?=(\d{3})+\.)/g, function ($0, $1) {
        return $1 + ',';
    }).replace(/\.$/, '');
}

/* 常用加解密 */
tool.crypto = {
    //MD5加密
    MD5(data: string) {
        return CryptoJS.MD5(data).toString()
    },
    //BASE64加解密
    BASE64: {
        encrypt(data: string) {
            return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(data))
        },
        decrypt(cipher: string) {
            return CryptoJS.enc.Base64.parse(cipher).toString(CryptoJS.enc.Utf8)
        }
    },
    //AES加解密
    AES: {
        encrypt(data: string, secretKey: string, config: keyable = {}) {
            if (secretKey.length % 8 != 0) {
                console.warn("[jiarui error]: 秘钥长度需为8的倍数，否则解密将会失败。")
            }
            const result = CryptoJS.AES.encrypt(data, CryptoJS.enc.Utf8.parse(secretKey), {
                iv: CryptoJS.enc.Utf8.parse(config.iv || ""),
                mode: CryptoJS.mode[config.mode as keyof typeof CryptoJS.mode || "ECB"],
                padding: CryptoJS.pad[config.padding as keyof typeof CryptoJS.pad || "Pkcs7"]
            })
            return result.toString()
        },
        decrypt(cipher: string, secretKey: string, config: keyable = {}) {

            const result = CryptoJS.AES.decrypt(cipher, CryptoJS.enc.Utf8.parse(secretKey), {
                iv: CryptoJS.enc.Utf8.parse(config.iv || ""),
                mode: CryptoJS.mode[config.mode as keyof typeof CryptoJS.mode || "ECB"],
                padding: CryptoJS.pad[config.padding as keyof typeof CryptoJS.pad || "Pkcs7"]
            })
            return CryptoJS.enc.Utf8.stringify(result);
        }
    }
}

export default tool
