<template>

    <el-dialog v-model="dialogAddVisible" title="新增" width="50%">

        <el-form :model="formInstance" label-width="120px">

            <el-form-item label="项目名称">
                <el-input v-model="formInstance.projectName" />
            </el-form-item>
            <el-form-item label="地区">
                <el-cascader v-model="formInstance.groupcity" :options="chinaAreas" :props="groupsProps"
                    @change="cityOnChange" />


            </el-form-item>
            <el-form-item label="开工日期">
                <el-input v-model="formInstance.startTime" />
            </el-form-item>
            <el-form-item label="竣工日期">
                <el-input v-model="formInstance.completeTime" />
            </el-form-item>
            <el-form-item label="业主姓名">
                <el-input v-model="formInstance.username"></el-input>
            </el-form-item>
            <el-form-item label="业主性质">
                <el-input v-model="formInstance.nature"></el-input>
            </el-form-item>
            <el-form-item label="工程类别">
                <el-input v-model="formInstance.category"></el-input>
            </el-form-item>
            <el-form-item label="工程类别细项">
                <el-input v-model="formInstance.categoryDetail"></el-input>
            </el-form-item>
            <el-form-item label="项目状态">
                <el-input v-model="formInstance.status"></el-input>
            </el-form-item>
            <el-form-item label="合同额">
                <el-input v-model="formInstance.contractPrice"></el-input>
            </el-form-item>
            <el-form-item label="结算时间">
                <el-input v-model="formInstance.finalTime"></el-input>
            </el-form-item>
            <el-form-item label="预计总收入">
                <el-input v-model="formInstance.estimateIncome"></el-input>
            </el-form-item>
            <el-form-item label="预计总成本">
                <el-input v-model="formInstance.estimateCost"></el-input>
            </el-form-item>
            <el-form-item label="计税方式">
                <el-input v-model="formInstance.taxWay"></el-input>
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
                <el-table-column prop="projectName" label="项目名称" fixed />
                <el-table-column label="省/市区">
                    <template #default="scope">
                        {{ planAreas.get(scope.row.province)?.name + "/" + planAreas.get(scope.row.city)?.name
                                +
                                "/" +
                                planAreas.get(scope.row.region)?.name
                        }}
                    </template>
                </el-table-column>

                <el-table-column prop="startTime" label="开工日期" />

                <el-table-column prop="completeTime" label="竣工日期" />
                <el-table-column prop="username" label="业主姓名" />
                <el-table-column prop="nature" label="业务性质" />
                <el-table-column prop="category" label="工程类别" />
                <el-table-column prop="categoryDetail" label="工程类别细项" />


                <el-table-column prop="status" label="项目状态" />
                <el-table-column prop="contractPrice" label="合同额" />
                <el-table-column prop="finalTime" label="结算时间" />
                <el-table-column prop="estimateIncome" label="预计总收入" />
                <el-table-column prop="estimateCost" label="预计总成本" />
                <el-table-column prop="taxWay" label="计税方式" />
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
            <el-pagination layout="prev, pager, next" :total="pageInfo.num" :page-size="pageInfo.size" small background
                @current-change="HandleCurrentChange" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { tools_objToobj } from '@/components/jrTools/index'
import { ProjectFetchList, ProjectPushRow } from '@/api/model/project';
import chinaAreas from '@/components/chinaareas/index'
import { Key } from '@element-plus/icons-vue';
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
getAllAreas(chinaAreas, planAreas.value)
console.log("pppppppppp", chinaAreas.length, planAreas.value.get(11)?.name)
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
    formInstance.value.groupcity = [formInstance.value.province, formInstance.value.city, formInstance.value.region]
}
const onCancel = () => {
    dialogAddVisible.value == false
}

/**
 * event handle with api
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
    console.log(",,,,,,,,,,,,,,,,", formInstance.value.province)
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
const groupsProps = {
    value: "code",
    label: "name",

}
const PushDataRow = async (body: any) => {

    ProjectPushRow(body).then((response: any) => {
        FetchDataList(listUriParams)
        dialogAddVisible.value = false

    })
}
const FetchDataList = async (row: any) => {
    loading.value = true
    ProjectFetchList(row).then((resdata: any) => {

        pageInfo.value.num = resdata["pagenum"]
        pageInfo.value.size = resdata["pagesize"]
        tableData.value.list = resdata["list"]

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
