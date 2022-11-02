<template>
    <el-dialog v-model="ui_show_btnall_visible" title="节点信息" width="80%">
        <div v-loading="loading">
            <el-tabs type="border-card" v-model="bigmytabs">
                <el-tab-pane label="基本信息" name="base1">

                    <el-form :model="pageCurrentItem" label-width="120px">
                        <el-form-item label="节点名称:">
                            <el-input v-model="pageCurrentItem.node_name" @blur="handel_update_node" />
                        </el-form-item>
                        <el-form-item label="节点超时:">
                            <el-input v-model="pageCurrentItem.timeout" @blur="handel_update_node" />
                        </el-form-item>
                    </el-form>


                </el-tab-pane>
                <el-tab-pane label="详细信息" name="detail1" :disabled="detaildisabled">
                    <PathEdit ref="view_path_edit" @patheditok="event_patheditok_cb"></PathEdit>
                    <CheckEdit ref="view_check_edit" @checkeditok="event_checkeditok_cb"></CheckEdit>
                    <BtnOkEdit ref="view_btnok_edit" @btnokeditok="event_btnokeditok_cb"></BtnOkEdit>
                    <BtnActEdit ref="view_btnact_edit" @btnacteditok="event_btnacteditok_cb"></BtnActEdit>
                    <el-space direction="vertical">
                        <el-space wrap>
                            <el-select placeholder="可选择" v-model="ui_btnconfmodel_value" @change="buttondefaultchange">
                                <el-option v-for="item, key in ui_btnconfoptions" :key="key" :label="item.label"
                                    :value="key" />
                            </el-select>
                            <el-input v-model="ui_btn_inputnewname" placeholder="请输入" />
                            <el-button type="primary" plain class="my-smallbutton" @click="clk_new_button">
                                新增按钮
                            </el-button>
                            <el-button type="primary" plain class="my-smallbutton" @click="clk_update_button">
                                修改按钮
                            </el-button>
                            <el-button type="primary" plain icon="ElIconDArrowLeft" @click="clk_leftmove_btn_name" />
                            <el-button type="primary" plain icon="ElIconDArrowRight" @click="clk_rightmove_btn_name" />
                            <el-popconfirm title="确定删除吗" @confirm="clk_delete_btn_name">
                                <template #reference>
                                    <el-button type="primary" plain icon="ElIconDelete" />
                                </template>
                            </el-popconfirm>


                        </el-space>

                        <el-tabs tab-position="top" v-model="ui_btn_inputcurname_index" type="border-card"
                            class="demo-tabs" @tab-click="btn_tabs_click">
                            <el-tab-pane :name="btn_index" v-for="(btn_item, btn_index) in instan_btninfo_map_sort"
                                v-bind:key="btn_index">
                                <template #label>
                                    <el-space wrap>
                                        <span>{{ btn_item?.btn_name + "," + btn_index }}</span>

                                    </el-space>
                                </template>
                                <template #default>
                                    <el-tabs tab-position="left" class="demo-tabs">
                                        <el-tab-pane label="按钮路径">
                                            <el-space direction="vertical">
                                                <el-button type="primary" plain class="my-smallbutton"
                                                    @click="clk_add_path(btn_item.btn_id)">
                                                    管理路径
                                                </el-button>
                                                <el-table :data="ui_my_btns_map_paths.get(btn_item.btn_id)" border
                                                    :model="ui_my_btns_map_paths.get(btn_item.btn_id)"
                                                    style="width: 100%" header-row-class-name="header-row">
                                                    <el-table-column label="下一个节点名称" width="450">
                                                        <template #default="scope">

                                                            {{ instan_nodes_map.get(scope.row.node_id)?.node_name }}

                                                        </template>
                                                    </el-table-column>
                                                    <el-table-column label="操作" width="150">
                                                        <template #default="scope">

                                                            <a v-on:click="clk_delete_path(scope.row)">删除</a>

                                                        </template>
                                                    </el-table-column>
                                                </el-table>
                                            </el-space>
                                        </el-tab-pane>

                                        <el-tab-pane label="字段检查项">
                                            <el-space direction="vertical">
                                                <el-button type="primary" plain class="my-smallbutton"
                                                    @click="clk_add_check(btn_item.btn_id)">
                                                    新增字段检查项
                                                </el-button>
                                                <el-table :data="ui_my_btns_map_checkinfs.get(btn_item.btn_id)" border
                                                    style="width: 100%" header-row-class-name="header-row">
                                                    <el-table-column prop="field_id" label="表单字段" width="150">
                                                        <template #default="scope">
                                                            {{ instan_fieldinfo_map.get(scope.row.field_id)?.field_name
                                                            }}
                                                        </template>
                                                    </el-table-column>
                                                    <el-table-column prop="type" label="字段判断符号" width="150" />
                                                    <el-table-column prop="value" label="判断值" width="150" />

                                                    <el-table-column label="操作" width="150">
                                                        <template #default="scope">

                                                            <a v-on:click="clk_delete_check(scope.row)">删除</a>
                                                        </template>


                                                    </el-table-column>
                                                </el-table>
                                            </el-space>
                                        </el-tab-pane>

                                        <el-tab-pane label="按钮生效条件">
                                            <el-space direction="vertical">
                                                <el-button type="primary" plain class="my-smallbutton"
                                                    @click="clk_add_btnok(btn_item.btn_id)">
                                                    新增按钮生效条件
                                                </el-button>
                                                <el-table :data="ui_my_btns_map_btnokinfs.get(btn_item.btn_id)" border
                                                    style="width: 100%" header-row-class-name="header-row">
                                                    <el-table-column label="表单字段" width="150">
                                                        <template #default="scope">
                                                            {{ instan_fieldinfo_map.get(scope.row.field_id)?.field_name
                                                            }}
                                                        </template>
                                                    </el-table-column>
                                                    <el-table-column prop="type" label="字段判断符号" width="150" />
                                                    <el-table-column prop="value" label="判断值" width="150" />
                                                    <el-table-column label="操作" width="150">
                                                        <template #default="scope">

                                                            <a v-on:click="clk_delete_btnok(scope.row)">删除</a>
                                                        </template>

                                                    </el-table-column>
                                                </el-table>
                                            </el-space>
                                        </el-tab-pane>

                                        <el-tab-pane label="按钮回调触发">
                                            <el-space direction="vertical">
                                                <el-button type="primary" plain class="my-smallbutton"
                                                    @click="clk_add_btnact">
                                                    新增按钮回调触发
                                                </el-button>
                                                <el-table :data="ui_my_btns_map_btnactinfs.get(btn_item.btn_id)" border
                                                    style="width: 100%" header-row-class-name="header-row">
                                                    <el-table-column prop="body" label="接口信息" width="450" />

                                                    <el-table-column label="操作" width="150">
                                                        <template #default="scope">
                                                            <a v-on:click="clk_delete_btnact(scope.$index)">删除</a>
                                                        </template>

                                                    </el-table-column>
                                                </el-table>
                                            </el-space>
                                        </el-tab-pane>
                                    </el-tabs>
                                </template>
                            </el-tab-pane>
                        </el-tabs>


                    </el-space>
                </el-tab-pane>
            </el-tabs>
            <div style="height:30px;margin: 0 auto;padding-top: 20px; text-align: center">
                <el-button type="primary" class="my-smallbutton" @click="form_submit">
                    确认
                </el-button>
                <el-popconfirm title="确定删除吗" @confirm="handel_delete_node">
                    <template #reference>
                        <el-button type="primary" class="my-smallbutton">
                            删除节点
                        </el-button>
                    </template>
                </el-popconfirm>
            </div>
        </div>
    </el-dialog>
</template>
<script lang="ts" setup>


//import { reactive, ref, defineProps, toRefs, defineExpose, watch } from 'vue';
import { ref, defineExpose, reactive, defineEmits, defineProps } from 'vue';
import { TabsPaneContext } from 'element-plus';
import { nodeinfo_str } from './node';
import { myMessageBoxErr, tools_get_uniq_id, tools_objToobj, tools_objToStrMap, tools_sort_map, tools_sort_map_loop, tools_strMapToObj, tools_updateFieldSort } from '@/components/jrTools/index'

import PathEdit from './PathEdit.vue'
import CheckEdit from './CheckEdit.vue'
import BtnOkEdit from './BtnOkEdit.vue'
import BtnActEdit from './BtnActEdit.vue'

import { buttoninfo_str, fieldinfo_str, btncheckinfo_str, btnactinfo_str, node_actinfo_str } from './common'

import { nodepathinfo_str } from './path';
import { FieldUriParams, flowNodeNewPush, FlowNodeRowFetch } from '@/api/model/flow';
import { flowbtnactNewPush, flowbtncheckNewPush, flowbtnokNewPush, flowButtonNewPush, flowPathNewPush } from '@/api/model/button';


class ALLACTIONS {
    //节点的增删改
    static btn_name = ""
    static ui_my_btns_map_nodes: Map<number, node_actinfo_str> = new Map<number, node_actinfo_str>()



    //按钮的删除
    static btn_delete(index: number) {

        let params = new Array<buttoninfo_str>()
        let info = instan_btninfo_map_sort.value[index]

        info.cmd_ = "delete"

        params.push(info)
        loading.value = true
        flowButtonNewPush(params).then((response: any) => {
            loading.value = false
            if (response.status == 200) {
                let body = response.data
                if (body["obj"] == "1") {

                    let btn_id = instan_btninfo_map_sort.value[index].btn_id
                    instan_btninfo_map_sort.value.splice(index, 1)

                    ui_my_btns_map_paths.value.delete(btn_id)
                    ui_my_btns_map_checkinfs.value.delete(btn_id)
                    ui_my_btns_map_btnokinfs.value.delete(btn_id)
                    ui_my_btns_map_btnactinfs.value.delete(btn_id)

                    if (index == 0) {

                        ui_btn_inputcurname_index.value = 0
                    }
                    ui_btn_inputcurname_index.value = index - 1
                    return
                }


            }
            myMessageBoxErr()
        }).catch((err: any) => {
            loading.value = false
            myMessageBoxErr()
        })




    }
    //按钮的增加

    static btn_add(btn_name: string) {
        let params = new Array<buttoninfo_str>()
        let btnbaseinfo: buttoninfo_str = new buttoninfo_str()
        btnbaseinfo.node_id = pageCurrentItem.value.node_id
        btnbaseinfo.btn_id = ""
        btnbaseinfo.cmd_ = "add"
        btnbaseinfo.btn_name = btn_name
        let maxsort = 2

        for (var i = 0; i < instan_btninfo_map_sort.value.length; i++) {

            if (instan_btninfo_map_sort.value[i].sort > maxsort) {
                maxsort = instan_btninfo_map_sort.value[i].sort
            }
        }
        maxsort += 1

        btnbaseinfo.sort = maxsort

        params.push(btnbaseinfo)
        loading.value = true
        flowButtonNewPush(params).then((response: any) => {
            loading.value = false
            if (response.status == 200) {
                let body = response.data
                if (body["obj"] == "1") {

                    if (body["reid"] != "") {
                        btnbaseinfo.btn_id = body["reid"]
                        btnbaseinfo.cmd_ = "edit"

                        instan_btninfo_map_sort.value.push(btnbaseinfo)

                    }
                    return
                }


            }
            myMessageBoxErr()
        }).catch((err: any) => {
            loading.value = false
            myMessageBoxErr()
        })
        //////////////////////////////////////





    }
    //按钮名称修改
    static btn_name_update(btn_name: string, index: number) {


        //////////////
        let params = new Array<buttoninfo_str>()
        let info = instan_btninfo_map_sort.value[index]
        info.btn_name = btn_name
        info.cmd_ = "edit"

        params.push(info)
        loading.value = true
        flowButtonNewPush(params).then((response: any) => {
            loading.value = false
            if (response.status == 200) {
                let body = response.data
                if (body["obj"] == "1") {



                    return
                }


            }
            myMessageBoxErr()
        }).catch((err: any) => {
            loading.value = false
            myMessageBoxErr()
        })


    }
    //按钮的移动
    static btn_leftmovesort(index: number) {
        if (index != 0) {
            let params = new Array<buttoninfo_str>()
            let btninfo = instan_btninfo_map_sort.value[index]
            btninfo.sort = index - 1
            btninfo.cmd_ = "edit"
            params.push(btninfo)
            btninfo = instan_btninfo_map_sort.value[index - 1]
            btninfo.sort = index
            btninfo.cmd_ = "edit"
            params.push(btninfo)
            //////////////////////////////
            loading.value = true
            flowButtonNewPush(params).then((response: any) => {
                loading.value = false
                if (response.status == 200) {
                    let body = response.data
                    if (body["obj"] == "1") {


                        tools_sort_map_loop<buttoninfo_str>(instan_btninfo_map_sort.value, 0, (a: buttoninfo_str): number => {
                            return a.sort
                        })
                        ui_btn_inputcurname_index.value = index - 1

                        return
                    }


                }
                myMessageBoxErr()
            }).catch((err: any) => {
                loading.value = false
                myMessageBoxErr()
            })
            //////////////////////////////


        }
        ui_btn_inputcurname_index.value = index
    }
    //按钮的移动
    static btn_rightmovesort(index: number) {
        if (index != instan_btninfo_map_sort.value.length - 1) {
            let params = new Array<buttoninfo_str>()
            let btninfo = instan_btninfo_map_sort.value[index]
            btninfo.sort = index + 1
            btninfo.cmd_ = "edit"
            params.push(btninfo)
            btninfo = instan_btninfo_map_sort.value[index + 1]
            btninfo.sort = index
            btninfo.cmd_ = "edit"
            params.push(btninfo)
            /////////////////


            loading.value = true
            flowButtonNewPush(params).then((response: any) => {
                loading.value = false
                if (response.status == 200) {
                    let body = response.data
                    if (body["obj"] == "1") {


                        tools_sort_map_loop<buttoninfo_str>(instan_btninfo_map_sort.value, 0, (a: buttoninfo_str): number => {
                            return a.sort
                        })
                        ui_btn_inputcurname_index.value = index + 1

                        return
                    }


                }
                myMessageBoxErr()
            }).catch((err: any) => {
                loading.value = false
                myMessageBoxErr()
            })
            ////////////////

        }
        ui_btn_inputcurname_index.value = index
    }
    //路径增加
    static path_add(selects: Array<nodeinfo_str>) {
        let curnode = instan_btninfo_map_sort.value[ui_btn_inputcurname_index.value];
        let btn_id = curnode.btn_id
        let list = ui_my_btns_map_paths.value.get(btn_id)
        if (list === undefined) {
            list = new Array<nodepathinfo_str>()
            ui_my_btns_map_paths.value.set(btn_id, list)
        }
        for (let indexnode in selects) {
            let hasid = false
            for (let index in list) {
                if (list[index].node_id == selects[indexnode].node_id) {

                    hasid = true;
                    break
                }
            }
            if (!hasid) {

                let path = new nodepathinfo_str()
                path.flow_id = ""
                path.node_id = selects[indexnode].node_id
                path.btn_id = btn_id
                list.push(path)
            }
        }

        /////////////////////////////
        let params = { list: list, btn_id: btn_id }
        loading.value = true
        flowPathNewPush(params).then((response: any) => {
            loading.value = false
            if (response.status == 200) {
                let body = response.data
                if (body["obj"] == "1") {

                    return
                }
            }
            myMessageBoxErr()
        }).catch((err: any) => {
            loading.value = false
            myMessageBoxErr()
        })



    }
    //路径的删除
    static path_delete(node_id: string) {
        let btn_id = instan_btninfo_map_sort.value[ui_btn_inputcurname_index.value].btn_id
        let listarray = ui_my_btns_map_paths.value.get(btn_id)
        if (listarray != undefined) {
            for (let i = 0; i < listarray.length; i++) {
                if (listarray[i].node_id === node_id) {
                    listarray.splice(i, 1)

                    break;
                }
            }
        }
        //////////
        let list = listarray
        let params = { list: list, btn_id: btn_id }
        loading.value = true
        flowPathNewPush(params).then((response: any) => {
            loading.value = false
            if (response.status == 200) {
                let body = response.data
                if (body["obj"] == "1") {

                    return
                }
            }
            myMessageBoxErr()
        }).catch((err: any) => {
            loading.value = false
            myMessageBoxErr()
        })

    }
    //判断条件增加
    static check_add(selects: Array<btncheckinfo_str>) {
        let curnode = instan_btninfo_map_sort.value[ui_btn_inputcurname_index.value];
        let btn_id = curnode.btn_id
        let list = ui_my_btns_map_checkinfs.value.get(btn_id)
        if (list == undefined) {
            list = new Array<btncheckinfo_str>()
            ui_my_btns_map_checkinfs.value.set(btn_id, list)
        }
        for (let indexnode in selects) {
            let hasid = false
            let curfield = selects[indexnode]
            for (let index in list) {
                if (list[index].field_id == curfield.field_id) {
                    hasid = true;
                    break
                }
            }
            if (!hasid) {


                list.push(selects[indexnode])
            }
        }

        ////////////////
        let params = { list: list, btn_id: btn_id }
        loading.value = true
        flowbtncheckNewPush(params).then((response: any) => {
            loading.value = false
            if (response.status == 200) {
                let body = response.data
                if (body["obj"] == "1") {

                    return
                }
            }
            myMessageBoxErr()
        }).catch((err: any) => {
            loading.value = false
            myMessageBoxErr()
        })
    }
    //判断条件的删除
    static check_delete(field_id: string) {
        let btn_id = instan_btninfo_map_sort.value[ui_btn_inputcurname_index.value].btn_id
        let listarray = ui_my_btns_map_checkinfs.value.get(btn_id)
        if (listarray != undefined) {
            for (let i = 0; i < listarray.length; i++) {
                if (listarray[i].field_id === field_id) {
                    listarray.splice(i, 1)


                    break;
                }
            }
        }
        ////////////////
        let list = listarray
        let params = { list: list, btn_id: btn_id }
        loading.value = true
        flowbtncheckNewPush(params).then((response: any) => {
            loading.value = false
            if (response.status == 200) {
                let body = response.data
                if (body["obj"] == "1") {

                    return
                }
            }
            myMessageBoxErr()
        }).catch((err: any) => {
            loading.value = false
            myMessageBoxErr()
        })



    }
    //按钮生效增加
    static btnok_add(selects: Array<btncheckinfo_str>) {
        let curnode = instan_btninfo_map_sort.value[ui_btn_inputcurname_index.value];
        let btn_id = curnode.btn_id
        let list = ui_my_btns_map_btnokinfs.value.get(btn_id)
        if (list == undefined) {
            list = new Array<btncheckinfo_str>()
            ui_my_btns_map_btnokinfs.value.set(btn_id, list)
        }
        for (let indexnode in selects) {
            let hasid = false
            let curfield = selects[indexnode]
            for (let index in list) {
                if (list[index].field_id == curfield.field_id) {
                    hasid = true;
                    break
                }
            }
            if (!hasid) {



                list.push(selects[indexnode])
            }
        }
        /////////////////
        let params = { list: list, btn_id: btn_id }
        loading.value = true
        flowbtnokNewPush(params).then((response: any) => {
            loading.value = false
            if (response.status == 200) {
                let body = response.data
                if (body["obj"] == "1") {

                    return
                }
            }
            myMessageBoxErr()
        }).catch((err: any) => {
            loading.value = false
            myMessageBoxErr()
        })

    }
    //按钮生效条件的删除
    static btnok_delete(field_id: string) {
        let btn_id = instan_btninfo_map_sort.value[ui_btn_inputcurname_index.value].btn_id
        let listarray = ui_my_btns_map_btnokinfs.value.get(btn_id)
        if (listarray != undefined)
            for (let i = 0; i < listarray.length; i++) {
                if (listarray[i].field_id === field_id) {
                    listarray.splice(i, 1)



                    break;
                }
            }
        /////////////
        let list = listarray
        let params = { list: list, btn_id: btn_id }
        loading.value = true
        flowbtnokNewPush(params).then((response: any) => {
            loading.value = false
            if (response.status == 200) {
                let body = response.data
                if (body["obj"] == "1") {

                    return
                }
            }
            myMessageBoxErr()
        }).catch((err: any) => {
            loading.value = false
            myMessageBoxErr()
        })

    }
    //按钮触发回调的删除
    static btnact_delete(index: number) {

        let btn_id = instan_btninfo_map_sort.value[ui_btn_inputcurname_index.value].btn_id
        let listarray = ui_my_btns_map_btnactinfs.value.get(btn_id)
        listarray?.splice(index, 1)
        let list = listarray
        let params = { list: list, btn_id: btn_id }
        loading.value = true
        flowbtnactNewPush(params).then((response: any) => {
            loading.value = false
            if (response.status == 200) {
                let body = response.data
                if (body["obj"] == "1") {

                    return
                }
            }
            myMessageBoxErr()
        }).catch((err: any) => {
            loading.value = false
            myMessageBoxErr()
        })


    }
    //按钮触发回调增加
    static btnact_add(body: string) {
        let curnode = instan_btninfo_map_sort.value[ui_btn_inputcurname_index.value];
        let btn_id = curnode.btn_id
        let listarray = ui_my_btns_map_btnactinfs.value.get(btn_id)
        if (listarray == undefined) {
            listarray = new Array<btnactinfo_str>()
            ui_my_btns_map_btnactinfs.value.set(btn_id, listarray)
        }
        let info = new btnactinfo_str()
        info.body = body
        listarray.push(info)
        //////////////
        let list = listarray
        let params = { list: list, btn_id: btn_id }
        loading.value = true
        flowbtnactNewPush(params).then((response: any) => {
            loading.value = false
            if (response.status == 200) {
                let body = response.data
                if (body["obj"] == "1") {

                    return
                }
            }
            myMessageBoxErr()
        }).catch((err: any) => {
            loading.value = false
            myMessageBoxErr()
        })


    }

    static all_data_clear() {
        ui_btn_inputcurname_index.value = 0
        ui_btnconfmodel_value.value = ''
        ui_btn_inputnewname.value = ''

        view_path_edit.value = null
        view_check_edit.value = null
        ui_form_path_info.value = null

        instan_btninfo_map_sort.value.splice(0)
        ui_my_btns_map_paths.value.clear()
        ui_my_btns_map_checkinfs.value.clear()
        ui_my_btns_map_btnokinfs.value.clear()
        ui_my_btns_map_btnactinfs.value.clear()
        //instan_nodes_map.clear()
        ui_btnconfoptions.value.splice(0)
        instan_fieldinfo_map.value.clear()


    }
}

let ui_btn_inputcurname_index = ref(0)
const ui_btnconfmodel_value = ref('')
const ui_btn_inputnewname = ref('')
const bigmytabs = ref('')
const pageCurrentItem = ref(new nodeinfo_str())
const ui_show_btnall_visible = ref(false)

const view_path_edit = ref()
const view_check_edit = ref()
const view_btnok_edit = ref()
const view_btnact_edit = ref()
const ui_form_path_info = ref()
const detaildisabled = ref(true)
const loading = ref(false)

const instan_btninfo_map_sort = ref(new Array<buttoninfo_str>())
const ui_my_btns_map_paths = ref(new Map<string, Array<nodepathinfo_str>>())
const ui_my_btns_map_checkinfs = ref(new Map<string, Array<btncheckinfo_str>>())
const ui_my_btns_map_btnokinfs = ref(new Map<string, Array<btncheckinfo_str>>())
const ui_my_btns_map_btnactinfs = ref(new Map<string, Array<btnactinfo_str>>())
var instan_nodes_map = ref(new Map<string, nodeinfo_str>())


var ui_btnconfoptions = ref(new Array<any>())
var instan_fieldinfo_map = ref(new Map<string, fieldinfo_str>())
const nodeeditokall = defineEmits(['nodeeditok'])

const props = defineProps({
    my_reques_flow_id: String,
});


var event_patheditok_cb = (selected: Array<nodeinfo_str>) => {
    ALLACTIONS.path_add(selected)

}

var event_checkeditok_cb = (selected: Array<btncheckinfo_str>) => {
    ALLACTIONS.check_add(selected)
}

var event_btnokeditok_cb = (selected: Array<btncheckinfo_str>) => {
    ALLACTIONS.btnok_add(selected)
}
var event_btnacteditok_cb = (body: string) => {
    ALLACTIONS.btnact_add(body)
}
var handel_update_node = () => {
    pageCurrentItem.value.timeout = Number(pageCurrentItem.value.timeout)
    loading.value = true

    flowNodeNewPush(pageCurrentItem.value).then((response: any) => {
        loading.value = false
        if (response.status == 200) {
            let body = response.data
            if (body["obj"] == "1") {

                if (body["reid"] != "") {
                    pageCurrentItem.value.node_id = body["reid"]

                    detaildisabled.value = false
                }
                return
            }


        }
        myMessageBoxErr()
    }).catch((err: any) => {
        loading.value = false
        myMessageBoxErr()
    })
}
var handel_delete_node = () => {


    pageCurrentItem.value.timeout = Number(pageCurrentItem.value.timeout)
    pageCurrentItem.value.cmd_ = "delete"

    loading.value = true
    flowNodeNewPush(pageCurrentItem.value).then((response: any) => {
        loading.value = false
        if (response.status == 200) {
            let body = response.data
            if (body["obj"] == "1") {

                nodeeditokall('nodeeditok', pageCurrentItem.value, ui_my_btns_map_paths.value)
                ui_show_btnall_visible.value = false
                return
            }


        }
        myMessageBoxErr()
    }).catch((err: any) => {
        loading.value = false
        myMessageBoxErr()
    })
}
var clk_add_path = (btn_id: string) => {
    let selectednodes = ui_my_btns_map_paths.value.get(btn_id)

    view_path_edit.value.PathEdit_Init(instan_nodes_map.value, selectednodes)
}
var clk_add_check = (btn_id: string) => {

    let selectedfields = ui_my_btns_map_checkinfs.value.get(btn_id)

    let compare_infos = ["<", ">", "=", ">=", "<=", "!="]
    view_check_edit.value.CheckEdit_Init(instan_fieldinfo_map.value, compare_infos, selectedfields)
}

var clk_add_btnok = (btn_id: string) => {
    let selectedfields = ui_my_btns_map_btnokinfs.value.get(btn_id)
    let compare_infos = ["<", ">", "=", ">=", "<=", "!="]


    view_btnok_edit.value.BtnOkEdit_Init(instan_fieldinfo_map.value, compare_infos, selectedfields)
}
var clk_add_btnact = () => {
    let compare_infos = ["<", ">", "=", ">=", "<=", "!="]


    view_btnact_edit.value.BtnActEdit_Init(instan_fieldinfo_map.value, compare_infos)
}
var clk_delete_path = (nodeinfo: any) => {
    ALLACTIONS.path_delete(nodeinfo.node_id)
}
var clk_delete_check = (param: any) => {
    let field_id = (param as btncheckinfo_str).field_id
    ALLACTIONS.check_delete(field_id)
}
var clk_delete_btnok = (param: any) => {
    let field_id = (param as btncheckinfo_str).field_id
    ALLACTIONS.btnok_delete(field_id)
}
var clk_delete_btnact = (index: number) => {

    ALLACTIONS.btnact_delete(index)
}
var btn_tabs_click = (pan: TabsPaneContext) => {


    if (pan.props.name != undefined) {
        let index = pan.props.name as number

        let val = instan_btninfo_map_sort.value[index]
        if (val != undefined) {
            ui_btn_inputnewname.value = val.btn_name
            ui_btn_inputcurname_index.value = index
        }

    }

}


var clk_update_button = () => {
    if (ui_btn_inputnewname.value.trim() == "")
        return
    ALLACTIONS.btn_name_update(ui_btn_inputnewname.value, ui_btn_inputcurname_index.value)

}
var clk_leftmove_btn_name = () => {
    ALLACTIONS.btn_leftmovesort(ui_btn_inputcurname_index.value)
}
var clk_rightmove_btn_name = () => {
    ALLACTIONS.btn_rightmovesort(ui_btn_inputcurname_index.value)
}
var clk_delete_btn_name = () => {

    ALLACTIONS.btn_delete(ui_btn_inputcurname_index.value)

}

var clk_new_button = () => {
    if (ui_btn_inputnewname.value.trim() == "")
        return
    ALLACTIONS.btn_add(ui_btn_inputnewname.value)

}
var buttondefaultchange = (value: number) => {
    ui_btn_inputnewname.value = ui_btnconfoptions.value[value].label
}



const handleClose = () => {
    ui_show_btnall_visible.value = false

}


const form_submit = () => {
    if (pageCurrentItem.value.node_name.trim() == "")
        alert("名称不能为空")


    nodeeditokall('nodeeditok', pageCurrentItem.value, instan_btninfo_map_sort.value, ui_my_btns_map_paths.value,
        ui_my_btns_map_checkinfs.value, ui_my_btns_map_btnokinfs.value, ui_my_btns_map_btnactinfs.value)
    ui_show_btnall_visible.value = false

}


const Asy_NodeEdit_Init = (
    infoBtnInfo: Array<buttoninfo_str>, infoPathsInfo: Map<string, Array<nodepathinfo_str>>,
    infoCheckInfo: Map<string, Array<btncheckinfo_str>>,
    infoBtnOkInfo: Map<string, Array<btncheckinfo_str>>,
    infoBtnActInfo: Map<string, Array<btnactinfo_str>>) => {

    instan_btninfo_map_sort.value = infoBtnInfo
    ui_my_btns_map_paths.value = infoPathsInfo
    ui_my_btns_map_checkinfs.value = infoCheckInfo
    ui_my_btns_map_btnokinfs.value = infoBtnOkInfo
    ui_my_btns_map_btnactinfs.value = infoBtnActInfo
    //结束

    ui_show_btnall_visible.value = true


    if (pageCurrentItem.value.cmd_ == "add") {
        detaildisabled.value = true
    }
    else {
        detaildisabled.value = false
    }
}
const NodeEdit_Init = (selectnode: nodeinfo_str, nodes_map: Map<string, nodeinfo_str>,
    infoBtnInfo: Array<buttoninfo_str>, infoPathsInfo: Map<string, Array<nodepathinfo_str>>,
    infoCheckInfo: Map<string, Array<btncheckinfo_str>>,
    infoBtnOkInfo: Map<string, Array<btncheckinfo_str>>,
    infoBtnActInfo: Map<string, Array<btnactinfo_str>>
) => {

    ALLACTIONS.all_data_clear()
    pageCurrentItem.value = selectnode
    bigmytabs.value = "base1"
    //去拿数据拿到以后展示，并把元数据传给nodeedit
    ui_btnconfoptions.value.push({ "label": "驳回" })
    ui_btnconfoptions.value.push({ "label": "下一步" })
    ui_btnconfoptions.value.push({ "label": "作废" })
    ui_btnconfoptions.value.push({ "label": "驳回" })
    ui_btnconfoptions.value.push({ "label": "通过" })
    instan_nodes_map.value = nodes_map

    if (pageCurrentItem.value.cmd_ != "add") {
        //固定配置
        let request = { flow_id: props.my_reques_flow_id ? props.my_reques_flow_id : "", node_id: selectnode.node_id }
        loading.value = true
        FlowNodeRowFetch(request).then((response: any) => {
            loading.value = false

            let tmpmap = tools_objToStrMap(response.data["obj"]["Btninfo"])
            infoBtnInfo.splice(0)
            tools_sort_map<number, buttoninfo_str>(tmpmap, infoBtnInfo, (a: buttoninfo_str): number => {
                return a.sort
            })

            for (let key in response.data["obj"]["Btnpathinfo"]) {
                infoPathsInfo.set((key), response.data["obj"]["Btnpathinfo"][key])
            }
            for (let key in response.data["obj"]["Btncheckinfo"]) {
                infoCheckInfo.set((key), response.data["obj"]["Btncheckinfo"][key])
            }
            for (let key in response.data["obj"]["Btnokinfo"]) {
                infoBtnOkInfo.set((key), response.data["obj"]["Btnokinfo"][key])
            }
            for (let key in response.data["obj"]["Btnactinfo"]) {
                infoBtnActInfo.set((key), response.data["obj"]["Btnactinfo"][key])
            }
            for (let key in response.data["obj"]["Fieldinfo"]) {
                instan_fieldinfo_map.value.set((key), response.data["obj"]["Fieldinfo"][key])
            }

            Asy_NodeEdit_Init(
                infoBtnInfo, infoPathsInfo,
                infoCheckInfo,
                infoBtnOkInfo,
                infoBtnActInfo)
        }).catch((err: any) => {
            loading.value = false
        })
        return

    }
    Asy_NodeEdit_Init(
        infoBtnInfo, infoPathsInfo,
        infoCheckInfo,
        infoBtnOkInfo,
        infoBtnActInfo)

}
const PageLoaded = () => {
}
defineExpose({
    NodeEdit_Init

})
</script>
<style scoped>
.demo-tabs>.el-tabs__content {
    padding: 32px;
    color: #6b778c;
    font-size: 32px;
    font-weight: 600;
}



.el-dialog .my-smallbutton {
    font-size: 10px;
    padding-top: 3px;
    padding-bottom: 3px;
    font-weight: normal;
    line-height: 10px
}

.el-table>>>.header-row th {
    background-color: #81D3F8 !important;
    color: #333333;
    font-size: 10px;
    font-weight: normal;
    line-height: 10px;
    padding-top: 3px;
    padding-bottom: 3px;
}

.el-table>>>td {
    font-size: 10px;
    font-weight: normal;
    line-height: 10px;
    padding-top: 3px;
    padding-bottom: 3px;
}

.el-table>>>td span {
    font-size: 10px;
    font-weight: normal;
    line-height: 10px;
    padding: 3px;

}

.el-table>>>td .cell {
    font-size: 10px;
    font-weight: normal;
    line-height: 10px;
    padding: 3px;
    margin: 3px;
}

.el-table>>>td button {
    font-size: 10px;
    font-weight: normal;
    line-height: 10px;
    padding: 0px;
    margin: 0px;
    height: 16px;
}

.el-dialog .el-dialog__footer {
    height: 150px;
}
</style>