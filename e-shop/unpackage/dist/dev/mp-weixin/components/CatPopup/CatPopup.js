"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = common_vendor.defineComponent({
  name: "CatPopup",
  data() {
    return {
      show: false,
      // 弹窗元素节点
      popup: null
    };
  },
  props: {
    mode: {
      type: String,
      default: "bottom"
    }
  },
  mounted() {
    this.popup = common_vendor.index.getElementById("popup");
  },
  methods: {
    open() {
      var _a, _b;
      this.show = true;
      (_b = (_a = this.popup) === null || _a === void 0 ? null : _a.style) === null || _b === void 0 ? null : _b.setProperty(this.mode, "0px");
    },
    close() {
      var _a, _b;
      (_b = (_a = this.popup) === null || _a === void 0 ? null : _a.style) === null || _b === void 0 ? null : _b.setProperty(this.mode, "-1000px");
      setTimeout(() => {
        this.show = false;
      }, 200);
    }
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  "raw js";
  return {
    a: common_vendor.sei("popup", "view"),
    b: common_vendor.n($props.mode),
    c: common_vendor.o(() => {
    }),
    d: common_vendor.sei(common_vendor.gei(_ctx, ""), "view"),
    e: $data.show ? 1 : "",
    f: common_vendor.o((...args) => $options.close && $options.close(...args))
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/CatPopup/CatPopup.js.map
