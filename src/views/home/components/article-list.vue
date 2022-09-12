<template>
  <div class="article-list" ref="article-list">
    <van-pull-refresh
      v-model="isRefreshLoading"
      @refresh="onRefresh"
      :success-text="refreshSuccessText"
      success-duration="800"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        :error.sync="error"
        error-text="请求失败, 点击重新加载"
      >
        <article-item
          v-for="(article, index) in list"
          :key="index"
          :article="article"
        ></article-item>
        <!-- <van-cell v-for="(article, index) in list" :key="index" :title="article.title" /> -->
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticles } from '@/api/article'
import ArticleItem from '@/components/article-item'
import { debounce } from 'lodash'
export default {
  name: 'ArticleList',
  components: {
    ArticleItem
  },
  props: {
    channel: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      list: [], // 存储列表数据的数组
      loading: false, // 控制加载中 loading状态
      finished: false, // 控制数据加载结束的状态
      timestamp: null, // 请求获取下一页数据的时间戳
      error: false, // 控制列表加载失败的提示状态
      isRefreshLoading: false, // 控制下拉刷新的loading状态
      refreshSuccessText: '刷新成功', // 下拉刷新成功提示文本
      scrollTop: 0 // 列表到顶部的距离
    }
  },
  created() {},
  mounted() {
    const articleList = this.$refs['article-list']
    articleList.onscroll = debounce(() => {
      console.log(1)
      this.scrollTop = articleList.scrollTop
    }, 50)
  },
  activated() {
    // console.log('从缓存中被激活')
    // 把记录的到顶部的距离重新设置回去
    this.$refs['article-list'].scrollTop = this.scrollTop
  },
  // deactivated() {
  //   console.log('组件失去活动了')
  // },
  methods: {
    // 初始化或滚动到底部的时候会触发调用onLoad
    async onLoad() {
      try {
        // 1. 请求获取数据
        const { data } = await getArticles({
          channel_id: this.channel.id, // 频道id
          // timestamp 简单理解就是请求数据的页码
          // 请求第1页数据: 当前最新时间戳
          // 用于请求之后数据的时间戳会在当前请求结果中返回给你
          timestamp: this.timestamp || Date.now(),
          with_top: 1 // 是否包含置顶, 0不包含 1包含
        })
        // 模拟随机失败的情况
        // if (Math.random() > 0.5) {
        //   JSON.parse('fsadfgasgs')
        // }
        // 2. 把请求结果数据放到list数组中
        const { results } = data.data
        this.list.push(...results)
        // 3. 本次数据加载结束之后要把加载状态设置为结束
        // loading 关闭以后才能触发下一次的加载更多
        this.loading = false
        // 4. 判断数据是否全部加载完成
        if (results.length) {
          // 更新获取下一页数据的时间戳
          this.timestamp = data.data.pre_timestamp
        } else {
          // 没有数据了, 将finished设置为true, 不再load加载更多了
          this.finished = true
        }
      } catch (err) {
        // 展示错误提示状态
        this.error = true
        // 请求失败了, loading也需要关闭
        this.loading = false
      }
    },

    // 当下拉刷新的时候会触发调用该函数
    async onRefresh() {
      try {
        // 1. 请求获取数据
        const { data } = await getArticles({
          channel_id: this.channel.id, // 频道id
          timestamp: Date.now(), // 下拉刷新, 每次请求获取最新数据, 所以传递当前最新时戳
          with_top: 1
        })

        // 模拟随机失败的情况
        // if (Math.random() > 0.2) {
        //   JSON.parse('fsadfgasgs')
        // }

        // 2. 将数据追加到列表的顶部
        const { results } = data.data
        this.list.unshift(...results)
        // 3. 关闭下拉刷新的loading状态
        this.isRefreshLoading = false

        // 更新下拉刷新成功提示文本
        this.refreshSuccessText = `刷新成功, 更新了${results.length}条数据`
      } catch (err) {
        this.isRefreshLoading = false
        this.refreshSuccessText = '刷新失败'
      }
    }
  }
}
</script>

<style lang="less" scoped>
.article-list {
  height: 79vh;
  overflow-y: auto;
}
</style>>
