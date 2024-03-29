// 平台属性管理模块请求文件
import request from '@/utils/request'

// 获取图片接口
// /admin/product/spuImageList/{spuId} get
export const reqSpuImageList = (spuId) => request({ url: `/admin/product/spuImageList/${spuId}`, method: 'get' })

// 获取销售属性
// /admin/product/spuSaleAttrList/{spuId} get
export const reqSpuSaleAttrList = (spuId) => request({ url: `/admin/product/spuSaleAttrList/${spuId}`, method: 'get' })

// 获取平属性信息
// /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id} get
export const reqAttrInfoList = (category1Id, category2Id, category3Id) => request({ url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`, method: 'get' })

// 获取sku信息
// /admin/product/list/{page}/{limit}
export const reqSkuList = (page, limit) => request({ url: `/admin/product/list/${page}/${limit}`, method: 'get' })

// 上架商品
// /admin/product/onSale/{skuId} get
export const reqSale = (skuId) => request({ url: `/admin/product/onSale/${skuId}`, method: 'get' })

// 下架商品
// /admin/product/cancelSale/{skuId}
export const reqCancel = (skuId) => request({ url: `/admin/product/cancelSale/${skuId}`, method: 'get' })

// 获取sku展示详情信息
// /admin/product/getSkuById/{skuId} get
export const reqSkuById = (skuId) => request({ url: `/admin/product/getSkuById/${skuId}`, method: 'get' })

