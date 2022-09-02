<template>

    <el-dialog v-model="dialogAddVisible" title="新增" width="50%">

        <el-form :model="form" label-width="120px">

            <el-form-item label="角色名称">
                <el-cascader v-model="form.rolename" :options="tableData" :props="groupsProps" clearable />
            </el-form-item>
            <el-form-item label="状态">
                <el-input v-model="form.status" />
            </el-form-item>
            <el-form-item label="序号">
                <el-input v-model="form.sort" />
            </el-form-item>
            <el-form-item label="时间">
                <el-input v-model="form.dtime" />
            </el-form-item>
            <el-form-item label="架构状态">
                <el-switch v-model="form.status" :active-value="1" :inactive-value="0"></el-switch>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" :loading="SubMitLoading" @click="onSubmit"><span
                        v-if="dialogIsAdd == true">保存增加</span><span v-else>保存修改</span>
                </el-button>
                <el-button @click="onCancel">取消</el-button>
            </el-form-item>
        </el-form>

    </el-dialog>
    <div style="float:right">
        <el-button text type="primary" @click="clk_add_flow">新增</el-button>
    </div>

    <el-table v-loading="loading" :data="tableData" row-key="id" border default-expand-all stripe style="width: 100%">
        <el-table-column prop="rolename" label="角色名称" width="180" />
        <el-table-column prop="dtime" label="修改时间" width="180" />
        <el-table-column prop="status" label="状态" width="180" />
        <el-table-column prop="sort" label="序号" width="180" />

        <el-table-column label="操作">
            <template #default="scope2">

                <el-popconfirm title="确定删除吗" @confirm="deleteRow(scope2.row)">
                    <template #reference>
                        <el-button link type="primary" size="small">
                            删除
                        </el-button>
                    </template>
                </el-popconfirm>
                <span>
                    <el-button text type="primary" @click.stop="clk_edit_flow(scope2.row)">编辑</el-button>
                </span>

            </template>
        </el-table-column>
    </el-table>
    <div style="float:right;margin: 20px;">
        <el-pagination layout="prev, pager, next" :total="flowListNum" :page-size="flowPageSize" small background
            @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>

</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'//
import { getCurrentInstance, ref } from 'vue'
import { reactive } from 'vue'

import { ts_object } from '@/utils/common'

import { tools_objToobj } from '@/components/jrTools/index'
import { OrganizeFetchList, OrganizePushRow, RoleFetchList, RolePushRow } from '@/api/model/setting'
interface keyable {
    [key: string]: any
}
class ListUriParams {
    page: number = 1
}
const groupsProps = {
    value: "id",
    label: "name",
    emitPath: false,
    checkStrictly: true
}
// do not use same name with ref


const dialogAddVisible = ref(false)
const dialogIsAdd = ref(true)
const loading = ref(true)
const flowListNum = ref(0)
const flowPageSize = ref(0)
const SubMitLoading = ref(false)
const form = reactive<keyable>({})
const router = useRouter()
const cns = getCurrentInstance()
const listUriParams = new ListUriParams()
const listUriParamspage = ref(0)
const tableData = ref(new Array<ts_object>())
const clk_add_flow = () => {
    dialogIsAdd.value = true
    dialogAddVisible.value = true
    SubMitLoading.value = false
    form.init()
}
const handleSizeChange = (val: number) => {

}
const handleCurrentChange = (val: number) => {

    listUriParams.page = val
    Get_Data_list(listUriParams)

}
const handleManageRow = (row: keyable) => {
    //: '/user', params: { username }
    //{ path: '/register', query: { plan: 'private' } 
    router.push({
        path: '/flowedit',
        query: { id: row.id }
        // name: 'WorkFlowEdit',
        // params: {
        //   id: row.id
        // }

    })
}
function clk_edit_flow(row: keyable) {

    // form.desc = row.desc
    // form.flow_name = row.
    // 	form.id = row.id

    tools_objToobj(row, form)

    dialogIsAdd.value = false
    SubMitLoading.value = false
    dialogAddVisible.value = true
}


const Get_Data_list = async (row: any) => {
    loading.value = true
    RoleFetchList(row).then((response: any) => {
        tableData.value.splice(0)

        if (response.status == 200) {

            let body = response.data

            flowListNum.value = body["num"]
            flowPageSize.value = body["size"]
            tableData.value = body["list"]

        }
        loading.value = false
    }).catch((err: any) => {
        loading.value = false
    })
}

const PageLoaded = () => {

    Get_Data_list(listUriParams)
}
PageLoaded()
const PushDataRow = async (body: any) => {

    RolePushRow(body).then((response: any) => {
        if (response.status == 200) {
            let body = response.data
            Get_Data_list(listUriParams)
            dialogAddVisible.value = false
        }

    })
}


const onCancel = () => {
    dialogAddVisible.value == false
}

const onSubmit = () => {
    if (form.name.trim() == "")
        return
    SubMitLoading.value = true
    if (dialogIsAdd.value == true) {
        form.cmd_ = "add"
    } else {
        form.cmd_ = "edit"
    }

    PushDataRow(form)
}
function deleteRow(row: any) {
    row.cmd_ = "delete"
    PushDataRow(row)
}




</script>
