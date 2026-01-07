"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = common_vendor.defineComponent({
  data() {
    return {};
  },
  methods: {
    /**
     * 退出登录点击
     */
    onLoginOut() {
      common_vendor.index.setStorageSync("isLogin", false);
      common_vendor.index.navigateBack();
    }
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  "raw js";
  return {
    a: common_assets._imports_1$1,
    b: common_assets._imports_1$1,
    c: common_assets._imports_1$1,
    d: common_assets._imports_1$1,
    e: common_vendor.o((...args) => $options.onLoginOut && $options.onLoginOut(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/setting/setting.js.map
