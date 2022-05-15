// 品牌管理api模块
import request from '@/utils/request'

// 获取品牌列表接口
// /admin/product/baseTrademark/{page}/{limit} get page当前页码 limit每页记录数
export const reqTradeMarkList = (page, limit) => request({ url: `/admin/product/baseTrademark/${page}/${limit}`, method: 'get' })

// 处理添加品牌操作
// /admin/product/baseTrademark/save post logoUrl tmName
// 处理修改品牌操作
// /admin/product/baseTrademark/update put id logoUrl tmName
export const reqAddOrUpdateTradeMark = (tradeMark) => {
    if (tradeMark.id) {
        // 带给服务器的数据带id，是修改品牌操作
        return request({ url: '/admin/product/baseTrademark/update', method: 'put', data: tradeMark })
    } else {
        // 新增品牌
        return request({ url: '/admin/product/baseTrademark/save', method: 'post', data: tradeMark })
    }
}

// 删除品牌
// /admin/product/baseTrademark/remove/{id} delete
export const reqDeleteTradeMark = (id) => request({ url: `/admin/product/baseTrademark/remove/${id}`, method: 'delete' })
