"use strict";
const common_vendor = require("../../../common/vendor.js");
const GoodsList = () => "../components/GoodsList/GoodsList.js";
const _sfc_main = common_vendor.defineComponent({
  components: { GoodsList },
  data() {
    return {};
  }
});
if (!Array) {
  const _component_goods_list = common_vendor.resolveComponent("goods-list");
  _component_goods_list();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  "raw js";
  return {
    a: common_vendor.gei(_ctx, ""),
    b: common_vendor.p({
      isSearch: true,
      id: common_vendor.gei(_ctx, "")
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/ShopDetails/ShopGoodsResult/ShopGoodsResult.js.map
