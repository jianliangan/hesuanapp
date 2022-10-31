
import { TreeKey } from "element-plus/es/components/tree/src/tree.type"
import 'element-plus/theme-chalk/el-message-box.css'
import { ElMessageBox } from 'element-plus'
export interface interface_with_sort {
    sort: number
}
const Get_Global_id = async (id: number) => {

}

export const tools_updateFieldSort = (vals: Array<interface_with_sort>) => {
    for (let i = 0; i < vals.length; i++) {
        vals[i].sort = i
    }
}
export var tools_sort_map_loop = <T>(big: Array<T>, index: number, fun: (val: T) => number) => {
    let smallsort: number = Number.MAX_VALUE
    let smallindex: number = -1

    if (index === big.length - 1 || big.length == 0)
        return
    for (let i = index; i < big.length; i++) {
        let val = big[i]
        if (fun(val) <= smallsort) {
            smallsort = fun(val)
            smallindex = i
        }
    }
    let tmp = big[index]
    big[index] = big[smallindex]
    big[smallindex] = tmp
    tools_sort_map_loop(big, index + 1, fun)
}
//:Map<number, btnpathinfo_str>
export var tools_sort_map = <TKEY, TVAL>(m: Map<TKEY, TVAL>, big: Array<TVAL>, fun: (val: TVAL) => number): Array<TVAL> => {

    if (m.size == 0)
        return big
    for (let val of m.values()) {
        big.push(val)
    }

    tools_sort_map_loop<TVAL>(big, 0, fun)
    return big

}

export var tools_strMapToObj = <TEY, TVAL>(strMap: Map<TEY, TVAL>) => {
    let obj = Object.create(null);
    for (let [k, v] of strMap) {
        obj[k] = v;
    }
    return obj;
}
export var tools_objToStrMap = (obj: any) => {
    let strMap = new Map();

    for (let k in obj) {

        strMap.set(k, obj[k]);
    }

    return strMap;
}
export var tools_objToobj = (source: any, dist: any) => {
    Object.keys(source).forEach((key, index) => {
        if ("function" != typeof source[key]) {
            dist[key] = source[key]
        }
    });
}

export var myMessageBoxErr = () => {
    ElMessageBox.alert('服务器发生错误，需要刷新页面', 'Title', {
        // if you want to disable its autofocus
        // autofocus: false,
        confirmButtonText: 'OK',
        callback: (action: any) => {
            location.reload()
        },
    })
}
export var applyClass = (elem: any, className: any) => {
    if (!className) return;

    if ((' ' + elem.className + ' ').indexOf(' ' + className + ' ') > -1) {
    } else {

        elem.classList.add(className);

    }
}