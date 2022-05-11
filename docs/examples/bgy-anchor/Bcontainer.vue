<template>
  <div style="display: flex">
    <div
      id="IDBig"
      ref="containerRef"
      style="flex: 10; margin-right: 30px; height: 500px; overflow-y: auto"
    >
      <div id="content-11" style="height: 200px; background-color: skyblue">
        anchor-content-1
      </div>
      <div id="content-12" style="height: 200px; background-color: greenyellow">
        anchor-content-2
      </div>
      <div id="content-13" style="height: 200px; background-color: #1f2f3d">
        anchor-content-3
      </div>
      <div id="content-14" style="height: 200px; background-color: hotpink">
        anchor-content-4
      </div>
      <div id="content-15" style="height: 200px; background-color: orange">
        anchor-content-5
      </div>
    </div>
    <el-bgy-anchor :offset="120" :get-container="getContainer" style="flex: 7">
      <el-bgy-anchor-link type="default" href="#content-11" title="基础锚点" />
      <el-bgy-anchor-link type="default" href="#content-12" title="多级锚点" />
      <el-bgy-anchor-link
        type="default"
        href="#content-13"
        title="指定容器锚点"
      />
      <el-bgy-anchor-link
        type="default"
        href="#content-14"
        title="特定交互锚点"
      />
      <el-bgy-anchor-link
        type="default"
        href="#content-15"
        title="不同尺寸的锚点"
      />
      <el-bgy-anchor-link type="default" href="#content-15"
        >我是自定义title</el-bgy-anchor-link
      >
    </el-bgy-anchor>
  </div>
</template>
