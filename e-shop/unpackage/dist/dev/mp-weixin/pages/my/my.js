"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = common_vendor.defineComponent({
  data() {
    return {
      statusBarHeight: 0,
      isLogin: false
    };
  },
  onLoad() {
    let windowInfo = common_vendor.index.getWindowInfo();
    this.statusBarHeight = windowInfo.statusBarHeight;
  },
  onShow() {
    this.isLogin = common_vendor.index.getStorageSync("isLogin");
  },
  methods: {
    /**
     * 工具点击
     * @param url
     */
    onTool(url) {
      common_vendor.index.navigateTo({
        url: `/pages/${url}/${url}`
      });
    },
    /**
     * 订单点击
     */
    onOrder() {
      common_vendor.index.navigateTo({
        url: "/pages/OrderList/OrderList"
      });
    }
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  "raw js";
  return common_vendor.e({
    a: common_assets._imports_0$2,
    b: common_vendor.o(($event) => $options.onTool("message")),
    c: common_assets._imports_1$2,
    d: common_vendor.o(($event) => $options.onTool("setting")),
    e: $data.isLogin
  }, $data.isLogin ? {
    f: common_assets._imports_1$1,
    g: common_vendor.o(($event) => $options.onTool("PersonalInfo"))
  } : {
    h: common_vendor.o(($event) => $options.onTool("login"))
  }, {
    i: $data.statusBarHeight + 140 + "px",
    j: $data.statusBarHeight + "px",
    k: common_assets._imports_3$1,
    l: common_vendor.o((...args) => $options.onOrder && $options.onOrder(...args)),
    m: common_assets._imports_4,
    n: common_vendor.o(($event) => $options.onTool("AfterSale"))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/my/my.js.map
