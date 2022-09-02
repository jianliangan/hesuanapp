<template>

    <el-dialog v-model="dialogAddVisible" title="新增" width="50%">

        <el-form :model="formInstance" label-width="120px">

            <el-form-item label="上级名称">
                <el-cascader v-model="formInstance.parentid" :options="tableData" :props="groupsProps" clearable />
            </el-form-item>
            <el-form-item label="架构名称">
                <el-input v-model="formInstance.name" />
            </el-form-item>
            <el-form-item label="架构描述">
                <el-input v-model="formInstance.desc" />
            </el-form-item>
            <el-form-item label="架构排序">
                <el-input v-model="formInstance.sort" />
            </el-form-item>
            <el-form-item label="架构状态">
                <el-switch v-model="formInstance.status" :active-value="1" :inactive-value="0"></el-switch>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" :loading="SubMitLoading" @click="OnSubmit"><span
                        v-if="dialogIsAdd == true">保存增加</span><span v-else>保存修改</span>
                </el-button>
                <el-button @click="onCancel">取消</el-button>
            </el-form-item>
        </el-form>

    </el-dialog>
    <div style="float:right">
        <el-button text type="primary" @click="ClkAddFlow">新增</el-button>
    </div>

    <el-table v-loading="loading" :data="tableData" row-key="id" border default-expand-all stripe style="width: 100%">
        <el-table-column prop="project_name" label="项目名称" width="180" />
        <el-table-column prop="province" label="省" width="180" />
        <el-table-column prop="city" label="市" width="180" />
        <el-table-column prop="region" label="区" width="180" />
        <el-table-column prop="start_time" label="开工日期" width="180" />

        <el-table-column prop="complete_time" label="竣工日期" width="180" />
        <el-table-column prop="username" label="业主姓名" width="180" />
        <el-table-column prop="nature" label="业务性质" width="180" />
        <el-table-column prop="category" label="工程类别" width="180" />
        <el-table-column prop="category_detail" label="工程类别细项" width="180" />


        <el-table-column prop="status" label="项目状态" width="180" />
        <el-table-column prop="contract_price" label="合同额" width="180" />
        <el-table-column prop="final_time" label="结算时间" width="180" />
        <el-table-column prop="estimate_income" label="预计总收入" width="180" />
        <el-table-column prop="estimate_cost" label="预计总成本" width="180" />
        <el-table-column prop="tax_way" label="计税方式" width="180" />
        <el-table-column label="操作">
            <template #default="scope">

                <el-popconfirm title="确定删除吗" @confirm="DeleteRow(scope.row)">
                    <template #reference>
                        <el-button link type="primary" size="small">
                            删除
                        </el-button>
                    </template>
                </el-popconfirm>
                <span>
                    <el-button text type="primary" @click.stop="ClkEditFlow(scope.row)">编辑</el-button>
                </span>

            </template>
        </el-table-column>
    </el-table>
    <div style="float:right;margin: 20px;">
        <el-pagination layout="prev, pager, next" :total="pageInfo.num" :page-size="pageInfo.size" small background
            @current-change="HandleCurrentChange" />
    </div>

</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { tools_objToobj } from '@/components/jrTools/index'
import { ProjectFetchList, ProjectPushRow } from '@/api/model/project';
interface baseObject {
    [key: string]: any
}


// do not use same name with ref


const dialogAddVisible = ref(false)
const dialogIsAdd = ref(true)
const loading = ref(true)
const pageInfo = ref<baseObject>({})
const SubMitLoading = ref(false)
const formInstance = ref<baseObject>({})
const listUriParams = {} as baseObject
const tableData = ref(new Array<baseObject>())
//event handles
const ClkAddFlow = () => {
    dialogIsAdd.value = true
    dialogAddVisible.value = true
    SubMitLoading.value = false
}

const HandleCurrentChange = (val: number) => {
    listUriParams.page = val
    FetchDataList(listUriParams)
}

function ClkEditFlow(row: baseObject) {
    tools_objToobj(row, formInstance.value)
    dialogIsAdd.value = false
    SubMitLoading.value = false
    dialogAddVisible.value = true
}
const onCancel = () => {
    dialogAddVisible.value == false
}

/**
 * event handle with api
 */

const OnSubmit = () => {
    if (formInstance.value.name.trim() == "")
        return
    SubMitLoading.value = true
    if (dialogIsAdd.value == true) {
        formInstance.value.cmd_ = "add"
    } else {
        formInstance.value.cmd_ = "edit"
    }
    PushDataRow(formInstance.value)
}
function DeleteRow(row: any) {
    row.cmd_ = "delete"
    PushDataRow(row)
}
/**
 * !!!!!need to change
 * api call
 */
const groupsProps = {
    value: "id",
    label: "name",
    emitPath: false,
    checkStrictly: true
}
const PushDataRow = async (body: any) => {

    ProjectPushRow(body).then((response: any) => {
        if (response.status == 200) {
            let body = response.data
            FetchDataList(listUriParams)
            dialogAddVisible.value = false
        }

    })
}
const FetchDataList = async (row: any) => {
    loading.value = true
    ProjectFetchList(row).then((response: any) => {
        tableData.value.splice(0)
        if (response.status == 200) {
            let body = response.data
            pageInfo.value.num = body["num"]
            pageInfo.value.size = body["size"]
            tableData.value = body["list"]

        }
        loading.value = false
    }).catch((err: any) => {
        loading.value = false
    })
}
//start init
const PageLoaded = () => {
    FetchDataList(listUriParams)
}
PageLoaded()
</script>
