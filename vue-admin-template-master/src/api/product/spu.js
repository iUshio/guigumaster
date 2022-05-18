// SPU管理api文件
import request from '@/utils/request'

// 获取spu列表数据
// /admin/product/{page}/{limit} get categoty3Id
export const reqSpuList = (page, limit, category3Id) => request({ url: `/admin/product/${page}/${limit}`, method: 'get', params: { category3Id } })



