<template>
  <div class="search-container">
    <!-- 搜索栏 -->
    <!-- Tips: 在 van-search 外层增加 form 标签，且 action 不为空，即可在 iOS 输入法中显示搜索按钮。 -->
    <form action="/" class="search-form">
      <van-search
        v-model="searchText"
        show-action
        placeholder="请输入搜索关键词"
        background="#3296fa"
        @search="onSearch"
        @cancel="onCancel"
        @focus="isResultShow = false"
      />
    </form>
    <!-- /搜索栏 -->

    <!-- 搜索结果 -->
    <search-result v-if="isResultShow" :search-text="searchText"></search-result>
    <!-- /搜索结果 -->

    <!-- 联想建议 -->
    <search-suggestion
      v-else-if="searchText"
      :search-text="searchText"
      @search="onSearch"
    ></search-suggestion>
    <!-- /联想建议 -->

    <!-- 搜索历史记录 -->
    <search-history
      v-else
      :search-histories="searchHistories"
      @search="onSearch"
      @update-histories="searchHistories = []"
    ></search-history>
    <!-- /搜索历史记录 -->
  </div>
</template>

<script>
import SearchHistory from './components/search-history.vue'
import SearchSuggestion from './components/search-suggestion.vue'
import SearchResult from './components/search-result.vue'
import { setItem, getItem } from '@/utils/storage'
// import { getUserSearchHistories } from '@/api/search'
import { mapState } from 'vuex'
export default {
  name: 'SearchIndex',
  components: {
    SearchHistory,
    SearchSuggestion,
    SearchResult
  },
  data() {
    return {
      searchText: '',
      isResultShow: false, // 控制搜索结果的展示
      searchHistories: getItem('search-histories') || [] // 搜索历史数据
    }
  },
  computed: {
    ...mapState(['user'])
  },
  watch: {
    searchHistories() {
      setItem('search-histories', this.searchHistories)
    }
  },
  created() {
    this.loadSearchHistories()
  },
  mounted() {},
  methods: {
    onSearch(val) {
      this.searchText = val

      const index = this.searchHistories.indexOf(val)
      if (index !== -1) {
        // 把重复项删除
        this.searchHistories.splice(index, 1)
      }
      // 记录搜索历史记录
      this.searchHistories.unshift(val)

      // 如果用户已登录, 则把搜索历史记录存储到线上
      //   提示: 只要我们调用获取搜索结果的数据接口, 后端会给我们自动存储用户的搜索历史记录
      // 如果没有登录, 则把搜索历史记录存储到本地
      // setItem('search-histories', this.searchHistories)

      this.isResultShow = true
    },

    async loadSearchHistories() {
      const searchHistories = getItem('search-histories') || []
      // if (this.user) {
      //   const { data } = await getUserSearchHistories()

      //   searchHistories = [...new Set([...searchHistories, ...data.data.keywords])]
      // }

      this.searchHistories = searchHistories
    },

    onCancel() {
      this.$router.back()
    }
  }
}
</script>

<style lang="less" scoped>
.search-container {
  padding-top: 108px;
  .van-search__action {
    color: #fff;
  }
  .search-form {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1;
  }
}
</style>>
