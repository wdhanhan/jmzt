"use strict";
const common_vendor = require("../../common/vendor.js");
const mock_classifyData = require("../../mock/classifyData.js");
const mock_couponData = require("../../mock/couponData.js");
require("../../mock/goodsData.js");
const _sfc_main = common_vendor.defineComponent({
  data() {
    return {
      classifyList: [],
      couponList: mock_couponData.CouponData,
      classifyId: 0
    };
  },
  onLoad() {
    this.getData();
  },
  methods: {
    getData() {
      if (mock_classifyData.ClassifyData[0].id === 0) {
        mock_classifyData.ClassifyData.splice(0, 1);
      }
      this.classifyList = mock_classifyData.ClassifyData;
      this.classifyList.unshift(new mock_classifyData.classifyItem({
        id: 0,
        parent: 0,
        name: "精选推荐",
        pic: "",
        children: []
      }));
    },
    /**
     * 分类点击
     * @param id
     */
    onClassify(id) {
      this.classifyId = id;
    },
    /**
     * 商品点击
     */
    onGoodsItem(item) {
      common_vendor.index.navigateTo({
        url: `/pages/GoodsDetail/GoodsDetail?goodsId=${item.id}`
      });
    }
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  "raw js";
  return {
    a: common_vendor.f($data.classifyList, (item, index, i0) => {
      return {
        a: common_vendor.t(item.name),
        b: $data.classifyId === item.id ? 1 : "",
        c: $data.classifyId === item.id ? 1 : "",
        d: common_vendor.o(($event) => $options.onClassify(item.id), index),
        e: index
      };
    }),
    b: common_vendor.f($data.couponList, (item, index, i0) => {
      return {
        a: common_vendor.f(item.goodsList, (value, idx, i1) => {
          return {
            a: value.pic,
            b: common_vendor.t(value.price),
            c: common_vendor.o(($event) => $options.onGoodsItem(value), idx),
            d: idx
          };
        }),
        b: common_vendor.t(item.fullPrice),
        c: common_vendor.t(item.subPrice),
        d: index
      };
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/CouponCenter/CouponCenter.js.map
