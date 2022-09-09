<template>
  <aj-table :MainContentFetchList="projectIndexFetchList"> </aj-table>
</template>

<script lang="ts" setup>
// :LeftTreeFetchList="ProjectFetchList"
// :MainContentPushRow="projectIndexPushRow"
import { ProjectFetchList } from "@/api/model/project";
import {
  ProjectIndexPushRow,
  ProjectIndexFetchList,
} from "@/api/model/projectindex";
let projectFetchList = ProjectFetchList;
let projectIndexFetchList = ProjectIndexFetchList;
let projectIndexPushRow = ProjectIndexPushRow;
</script>
