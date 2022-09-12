/**
 * 文章请求模块
 */
import request from '@/utils/request'
/**
 * 请求获取文章列表数据
 */
export const getSearchSuggestions = q => {
  return request({
    method: 'GET',
    url: '/v1_0/suggestion',
    params: {
      q
    }
  })
}

export const getSearchResult = params => {
  return request({
    method: 'GET',
    url: '/v1_0/search',
    params
  })
}

/**
 * 获取用户搜索历史记录
 */
export const getUserSearchHistories = () => {
  return request({
    method: 'GET',
    url: '/v1_0/search/histories'
  })
}
