"use strict";
const common_vendor = require("../../../../common/vendor.js");
const common_assets = require("../../../../common/assets.js");
const _sfc_main = common_vendor.defineComponent({
  data() {
    return {
      statusBarHeight: 0,
      statusBarBottom: 0
    };
  },
  props: {
    flagStr: {
      type: String,
      default: "home"
    }
  },
  mounted() {
    let windowInfo = common_vendor.index.getWindowInfo();
    this.statusBarHeight = windowInfo.statusBarHeight;
    this.statusBarBottom = windowInfo.safeAreaInsets.bottom;
  },
  methods: {
    /**
     * 导航点击
     * @param flag
     */
    onToNav(flag) {
      this.flagStr = flag;
      let url = "";
      switch (flag) {
        case "home":
          url = "/pages/ShopDetails/ShopDetails";
          break;
        case "goods":
          url = "/pages/ShopDetails/ShopGoods/ShopGoods";
          break;
        case "class":
          url = "/pages/ShopDetails/ShopClassify/ShopClassify";
          break;
      }
      const currentRoute = getCurrentPages()[getCurrentPages().length - 1].route;
      const nowUrl = `/${currentRoute}`;
      if (nowUrl !== url) {
        common_vendor.index.redirectTo({
          url
        });
      }
    }
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  "raw js";
  return {
    a: common_assets._imports_0$11,
    b: $props.flagStr === "home",
    c: common_assets._imports_1$14,
    d: $props.flagStr !== "home",
    e: $props.flagStr === "home" ? 1 : "",
    f: common_vendor.o(($event) => $options.onToNav("home")),
    g: common_assets._imports_2$8,
    h: $props.flagStr === "goods",
    i: common_assets._imports_3$4,
    j: $props.flagStr !== "goods",
    k: $props.flagStr === "goods" ? 1 : "",
    l: common_vendor.o(($event) => $options.onToNav("goods")),
    m: common_assets._imports_4$4,
    n: $props.flagStr === "class",
    o: common_assets._imports_5$3,
    p: $props.flagStr !== "class",
    q: $props.flagStr === "class" ? 1 : "",
    r: common_vendor.o(($event) => $options.onToNav("class")),
    s: common_vendor.sei(common_vendor.gei(_ctx, ""), "view"),
    t: $data.statusBarBottom + "px"
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/pages/ShopDetails/components/ShopTabNar/ShopTabNar.js.map
