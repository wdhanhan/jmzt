"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = common_vendor.defineComponent({
  data() {
    return {};
  },
  methods: {
    previewImage() {
      common_vendor.index.previewImage({
        urls: ["https://m.360buyimg.com/mobilecms/s1265x1265_jfs/t1/220910/16/35955/54305/64e8bec4F86f0f1e7/8d78e685620a0712.jpg!q70.dpg.webp"],
        current: 0
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
        b: common_vendor.o((...args) => $options.previewImage && $options.previewImage(...args), index),
        c: index
      };
    }),
    b: common_assets._imports_0$8,
    c: common_assets._imports_1$7,
    d: common_assets._imports_1$7,
    e: common_assets._imports_1$7,
    f: common_assets._imports_1$7,
    g: common_assets._imports_2$4
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/GoodsEvaluate/GoodsEvaluate.js.map
