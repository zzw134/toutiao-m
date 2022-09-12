<template>
  <div id="app">
    <!-- 因为router-view 是一级路由出口 keep-alive仅对该路由出口渲染的组件有效 -->
    <keep-alive :include="cachePages">
      <!-- 路由出口 -->
      <router-view />
    </keep-alive>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'App',
  computed: {
    ...mapState(['cachePages'])
  }
}
</script>

<style lang="less">
</style>
