<template>
  <el-container>
    <el-aside width="200px">
      <aj-Tree :LeftTreeFetchList="ProjectFetchTree"></aj-Tree> </el-aside
  ></el-container>
</template>
<script lang="ts" setup>
import { ProjectFetchTree } from "@/api/model/project";
</script>