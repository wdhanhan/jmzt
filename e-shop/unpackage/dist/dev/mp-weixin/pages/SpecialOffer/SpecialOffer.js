"use strict";
const common_vendor = require("../../common/vendor.js");
const mock_goodsData = require("../../mock/goodsData.js");
const mock_bannerData = require("../../mock/bannerData.js");
const mock_classifyData = require("../../mock/classifyData.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = common_vendor.defineComponent({
  data() {
    return {
      statusBarHeight: 0,
      classifyList: [],
      goodsList: mock_goodsData.goodsData,
      bannerList: mock_bannerData.BannerData,
      classifyId: 0
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
    formatPrice(price, type) {
      let strPrice = price.toString();
      let start = strPrice.split(".")[0];
      let end = "";
      try {
        end = strPrice.split(".")[1];
      } catch (e) {
        end = "";
      }
      return type === 0 ? start : end;
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
    g: common_vendor.f($data.bannerList, (item, index, i0) => {
      return {
        a: common_vendor.t(index),
        b: item.pic,
        c: item.id
      };
    }),
    h: $data.statusBarHeight + 50 + "px",
    i: common_vendor.f($data.classifyList, (item, index, i0) => {
      return {
        a: common_vendor.t(item.name),
        b: $data.classifyId === item.id ? 1 : "",
        c: $data.classifyId === item.id ? 1 : "",
        d: common_vendor.o(($event) => $options.onClassify(item.id), index),
        e: index
      };
    }),
    j: common_vendor.f($data.goodsList, (item, index, i0) => {
      return common_vendor.e({
        a: item.pic,
        b: common_vendor.t(item.name),
        c: common_vendor.t($options.formatPrice(item.price, 0)),
        d: $options.formatPrice(item.price, 1)
      }, $options.formatPrice(item.price, 1) ? {
        e: common_vendor.t($options.formatPrice(item.price, 1))
      } : {}, {
        f: common_vendor.t(item.salesVolume),
        g: index
      });
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/SpecialOffer/SpecialOffer.js.map
