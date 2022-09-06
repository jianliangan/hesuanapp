<template>

    <el-dialog v-model="dialogAddVisible" title="新增" width="50%">

        <el-form :model="formInstance" label-width="120px">

            <el-form-item label="项目id">
                <el-input v-model="formInstance.projectId" />
            </el-form-item>
            <el-form-item label="工程名称">
                <el-input v-model="formInstance.constructionName" />
            </el-form-item>
            <el-form-item label="工期">
                <el-input v-model="formInstance.duration" />
            </el-form-item>
            <el-form-item label="备注">
                <el-input v-model="formInstance.comment" />
            </el-form-item>

            <el-form-item>
                <el-button type="primary" :loading="SubMitLoading" @click="OnSubmit"><span
                        v-if="dialogIsAdd == true">保存增加</span><span v-else>保存修改</span>
                </el-button>
                <el-button @click="onCancel">取消</el-button>
            </el-form-item>
        </el-form>

    </el-dialog>

    <el-button text type="primary" @click="ClkAddFlow">新增</el-button>
    <div ref="mainframe" :style="{ 'height': '100%', 'overflow': 'hidden' }">

        <div class="scTable-table" :style="{ 'height': tableData.tablePackageHeight }">
            <el-table v-loading="loading" :data="tableData.list" row-key="id" border default-expand-all stripe
                :height="tableData.tableHeight">
                <el-table-column prop="projectId" label="项目id" fixed />

                <el-table-column prop="constructionName" label="工程名称" />

                <el-table-column prop="duration" label="工期" />
                <el-table-column prop="comment" label="备注" />

                <el-table-column label="操作" fixed="right" width="150">
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
        </div>

        <div class="scTable-page">
            <el-pagination layout="prev, pager, next" :total="pageInfo.itemTotal" :page-size="pageInfo.pageSize" small
                background @current-change="HandleCurrentChange" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { tools_objToobj } from '@/components/jrTools/index'
/**
 * !!!!!need to change
 * api call
 */
//import chinaAreas from '@/components/chinaareas/index'
/**
 * !!!!!need to change
 * api call
 */
import { ConstructionFetchList, ConstructionPushRow } from '@/api/model/construction';
interface baseObject {
    [key: string]: any
}
let planAreas = ref(new Map<string, baseObject>());
function getAllAreas(areas: Array<baseObject>, result: Map<string, baseObject>) {
    if (areas == undefined)
        return
    for (let i = 0; i < areas.length; i++) {
        getAllAreas(areas[i].children, result)
        result.set(areas[i].code, { code: areas[i].code, name: areas[i].name })
    }
}
/**
 * !!!!!need to change
 * api call
 */
//getAllAreas(chinaAreas, planAreas.value)

// do not use same name with ref

const mainframe = ref<baseObject>({})
const dialogAddVisible = ref(false)
const dialogIsAdd = ref(true)
const loading = ref(true)
const pageInfo = ref<baseObject>({})
const SubMitLoading = ref(false)
const formInstance = ref<baseObject>({})
const listUriParams = {} as baseObject
const tableData = ref<baseObject>({})
//
tableData.value.tableHeight = computed(
    {
        get() {


            let tt = tableData.value.tablePackageHeight

            return tt
        },
        set() {

        }

    }
)
tableData.value.tablePackageHeight = computed(
    {
        get() {
            return (mainframe.value.offsetHeight - 50 - 32) + "px"
        },
        set() {

        }

    }
)

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
    /**
 * !!!!!need to change
 * api call
 */
    //formInstance.value.groupcity = [formInstance.value.province, formInstance.value.city, formInstance.value.region]
}
const onCancel = () => {
    dialogAddVisible.value == false
}

/**
 * !!!!!need to change
 * api call
 */
let cityOnChange = () => {
    formInstance.value.province = formInstance.value.groupcity[0]
    formInstance.value.city = formInstance.value.groupcity[1]
    formInstance.value.region = formInstance.value.groupcity[2]
}
const OnSubmit = () => {

    SubMitLoading.value = true
    if (dialogIsAdd.value == true) {
        formInstance.value.cmd = "add"
    } else {
        formInstance.value.cmd = "edit"
    }
    //console.log(",,,,,,,,,,,,,,,,", formInstance.value.province)
    PushDataRow(formInstance.value)
}
function DeleteRow(row: any) {
    row.cmd = "delete"
    PushDataRow(row)
}
/**
 * !!!!!need to change
 * api call
 */
// const groupsProps = {
//     value: "code",
//     label: "name",

// }
/**
 * !!!!!need to change
 * api call
 */
const PushDataRow = async (body: any) => {

    ConstructionPushRow(body).then((response: any) => {
        FetchDataList(listUriParams)
        dialogAddVisible.value = false

    })
}
/**
 * !!!!!need to change
 * api call
 */
const FetchDataList = async (row: any) => {
    loading.value = true
    ConstructionFetchList(row).then((resdata: any) => {

        pageInfo.value.itemTotal = parseInt(resdata["itemTotal"])
        pageInfo.value.pageSize = parseInt(resdata["pageSize"])
        tableData.value.list = resdata["list"]
        console.log(",,,,,,,,,,,,,,,,", pageInfo.value)
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
<style scoped>
.scTable-table {
    height: calc(100% - 50px);
}

.scTable-page {
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 15px;
}
</style>
