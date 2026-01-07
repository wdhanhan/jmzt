"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = common_vendor.defineComponent({
  data() {
    return {
      statusBarBottom: 0
    };
  },
  onLoad() {
    const windowInfo = common_vendor.index.getWindowInfo();
    this.statusBarBottom = windowInfo.safeAreaInsets.bottom;
  },
  methods: {
    /**
     * 新建地址点击
     */
    onAdd() {
      common_vendor.index.navigateTo({
        url: "/pages/AddressAddEdit/AddressAddEdit"
      });
    }
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  "raw js";
  return {
    a: common_vendor.f(3, (item, index, i0) => {
      return {
        a: common_vendor.t(item),
        b: index
      };
    }),
    b: common_assets._imports_1$1,
    c: common_vendor.o((...args) => $options.onAdd && $options.onAdd(...args)),
    d: $data.statusBarBottom + "px",
    e: common_vendor.sei(common_vendor.gei(_ctx, ""), "view"),
    f: $data.statusBarBottom + 60 + "px"
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/AddressList/AddressList.js.map
