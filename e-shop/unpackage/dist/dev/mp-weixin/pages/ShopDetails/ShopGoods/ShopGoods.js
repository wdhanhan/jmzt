"use strict";
const common_vendor = require("../../../common/vendor.js");
const ShopTabNar = () => "../components/ShopTabNar/ShopTabNar.js";
const GoodsList = () => "../components/GoodsList/GoodsList.js";
const _sfc_main = common_vendor.defineComponent({
  components: { ShopTabNar, GoodsList },
  data() {
    return {
      statusBarHeight: 0,
      statusBarBottom: 0
    };
  },
  onLoad() {
    let windowInfo = common_vendor.index.getWindowInfo();
    this.statusBarHeight = windowInfo.statusBarHeight;
    this.statusBarBottom = windowInfo.safeAreaInsets.bottom;
  }
});
if (!Array) {
  const _component_goods_list = common_vendor.resolveComponent("goods-list");
  const _component_shop_tab_nar = common_vendor.resolveComponent("shop-tab-nar");
  (_component_goods_list + _component_shop_tab_nar)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  "raw js";
  return {
    a: common_vendor.p({
      flagStr: "goods"
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/ShopDetails/ShopGoods/ShopGoods.js.map
