"use strict";
const common_vendor = require("../../common/vendor.js");
const mock_bannerData = require("../../mock/bannerData.js");
const mock_classifyData = require("../../mock/classifyData.js");
const mock_goodsData = require("../../mock/goodsData.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = common_vendor.defineComponent({
  data() {
    return {
      statusBarHeight: 0,
      bannerList: mock_bannerData.BannerData,
      classifyList: [],
      classifyId: 0,
      brandList: mock_goodsData.brandGoodsData
    };
  },
  onLoad() {
    let windowInfo = common_vendor.index.getWindowInfo();
    this.statusBarHeight = windowInfo.statusBarHeight;
    this.getData();
  },
  methods: {
    /**
     * 返回点击
     */
    onBack() {
      common_vendor.index.navigateBack();
    },
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
     * @param id
     */
    onGoodsItem(id) {
      common_vendor.index.navigateTo({
        url: `/pages/GoodsDetail/GoodsDetail?goodsId=${id}`
      });
    }
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  "raw js";
  return {
    a: common_assets._imports_0$4,
    b: common_vendor.o((...args) => $options.onBack && $options.onBack(...args)),
    c: common_assets._imports_1$11,
    d: common_assets._imports_2$3,
    e: $data.statusBarHeight + 50 + "px",
    f: $data.statusBarHeight + "px",
    g: $data.statusBarHeight + 50 + "px",
    h: common_vendor.f($data.bannerList, (item, index, i0) => {
      return {
        a: item.pic,
        b: index
      };
    }),
    i: common_vendor.f($data.classifyList, (item, index, i0) => {
      return {
        a: common_vendor.t(item.name),
        b: $data.classifyId === item.id ? 1 : "",
        c: $data.classifyId === item.id ? 1 : "",
        d: common_vendor.o(($event) => $options.onClassify(item.id), index),
        e: index
      };
    }),
    j: common_vendor.f($data.brandList, (item, index, i0) => {
      return {
        a: common_vendor.f(item.goodsList, (value, idx, i1) => {
          return {
            a: value.pic,
            b: common_vendor.t(value.price),
            c: common_vendor.o(($event) => $options.onGoodsItem(value.id), idx),
            d: idx
          };
        }),
        b: item.bgPic,
        c: item.logo,
        d: index
      };
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/brand/brand.js.map
