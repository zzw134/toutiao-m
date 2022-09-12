/**
 * 评论请求模块
 */
import request from '@/utils/request'

/**
 * 获取文章评论列表
 */
export const getComments = params => {
  return request({
    method: 'Get',
    url: '/v1_0/comments',
    params
  })
}

/**
 * 评论点赞
 */
export const addCommentLike = target => {
  return request({
    method: 'POST',
    url: '/v1_0/comment/likings',
    data: {
      target
    }
  })
}

/**
 * 取消评论点赞
 */
export const deleteCommentLike = target => {
  return request({
    method: 'DELETE',
    url: `/v1_0/comment/likings${target}`
  })
}

/**
 * 发布文章评论或评论的回复
 */
export const addComment = data => {
  return request({
    method: 'POST',
    url: '/v1_0/comments',
    data
  })
}
