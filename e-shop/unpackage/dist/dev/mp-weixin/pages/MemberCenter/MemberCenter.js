"use strict";
const common_vendor = require("../../common/vendor.js");
const mock_goodsData = require("../../mock/goodsData.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = common_vendor.defineComponent({
  data() {
    return {
      statusBarHeight: 0,
      pageScrollTop: 0,
      goodsList: mock_goodsData.goodsData
    };
  },
  onLoad() {
    let windowInfo = common_vendor.index.getWindowInfo();
    this.statusBarHeight = windowInfo.statusBarHeight;
  },
  methods: {
    onBack() {
      common_vendor.index.navigateBack();
    },
    /**
     * 页面滑动事件
     * @param e
     */
    onPageScroll(e) {
      let scrollTop = e.detail.scrollTop;
      let top = scrollTop / 100;
      this.pageScrollTop = top;
      if (top >= 1) {
        this.pageScrollTop = 1;
      }
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
    }
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  "raw js";
  return {
    a: common_assets._imports_0$2,
    b: common_vendor.o((...args) => $options.onBack && $options.onBack(...args)),
    c: common_assets._imports_1$5,
    d: $data.statusBarHeight + 50 + "px",
    e: $data.statusBarHeight + "px",
    f: "rgba(255,255,255," + $data.pageScrollTop + ")",
    g: common_assets._imports_2$5,
    h: $data.statusBarHeight + 50 + "px",
    i: common_assets._imports_3$2,
    j: common_assets._imports_4$2,
    k: common_assets._imports_5,
    l: common_assets._imports_6$1,
    m: common_assets._imports_7,
    n: common_assets._imports_8,
    o: common_assets._imports_9,
    p: common_assets._imports_10,
    q: common_assets._imports_11,
    r: common_vendor.f($data.goodsList, (item, index, i0) => {
      return common_vendor.e({
        a: item.pic,
        b: common_vendor.t(item.name),
        c: common_vendor.t($options.formatPrice(item.price, 0)),
        d: $options.formatPrice(item.price, 1)
      }, $options.formatPrice(item.price, 1) ? {
        e: common_vendor.t($options.formatPrice(item.price, 1))
      } : {}, {
        f: index
      });
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/MemberCenter/MemberCenter.js.map
