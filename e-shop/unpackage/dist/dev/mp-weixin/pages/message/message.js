"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = common_vendor.defineComponent({
  data() {
    return {
      messageCut: 1
    };
  },
  methods: {
    /**
     * tab点击
     * @param type
     */
    onTab(type) {
      this.messageCut = type;
    }
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  "raw js";
  return {
    a: $data.messageCut === 1 ? 1 : "",
    b: $data.messageCut === 1,
    c: common_vendor.o(($event) => $options.onTab(1)),
    d: $data.messageCut === 2 ? 1 : "",
    e: $data.messageCut === 2,
    f: common_vendor.o(($event) => $options.onTab(2)),
    g: common_vendor.f(10, (item, index, i0) => {
      return {
        a: common_vendor.t(item),
        b: index
      };
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/message/message.js.map
