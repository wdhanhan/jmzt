"use strict";
const common_vendor = require("../../common/vendor.js");
const mock_goodsData = require("../../mock/goodsData.js");
const common_assets = require("../../common/assets.js");
const ShopTabNar = () => "./components/ShopTabNar/ShopTabNar.js";
const _sfc_main = common_vendor.defineComponent({
  components: {
    ShopTabNar
  },
  data() {
    return {
      statusBarHeight: 0,
      statusBarBottom: 0,
      shopName: "",
      dayGoods: mock_goodsData.dayData,
      goodsList: mock_goodsData.goodsData
    };
  },
  onLoad(options) {
    let windowInfo = common_vendor.index.getWindowInfo();
    this.statusBarHeight = windowInfo.statusBarHeight;
    this.statusBarBottom = windowInfo.safeAreaInsets.bottom;
    this.shopName = options.get("name");
  },
  methods: {
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
    },
    /**
     * 商品点击
     */
    onGoodsItem(item) {
      common_vendor.index.navigateTo({
        url: `/pages/GoodsDetail/GoodsDetail?goodsId=${item.id}`
      });
    }
  }
});
if (!Array) {
  const _component_shop_tab_nar = common_vendor.resolveComponent("shop-tab-nar");
  _component_shop_tab_nar();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  "raw js";
  return {
    a: common_assets._imports_0$6,
    b: common_vendor.t($data.shopName),
    c: common_assets._imports_1$1,
    d: common_assets._imports_1$7,
    e: common_assets._imports_1$7,
    f: common_assets._imports_1$7,
    g: common_assets._imports_1$7,
    h: common_assets._imports_2$4,
    i: common_vendor.f($data.dayGoods, (item, index, i0) => {
      return {
        a: item.pic,
        b: common_vendor.t(item.name),
        c: common_vendor.t(item.price),
        d: common_vendor.o(($event) => $options.onGoodsItem(item), index),
        e: index
      };
    }),
    j: common_vendor.f($data.goodsList, (item, index, i0) => {
      return common_vendor.e({
        a: item.pic,
        b: common_vendor.t(item.name),
        c: common_vendor.t(item.salesVolume),
        d: common_vendor.t($options.formatPrice(item.price, 0)),
        e: $options.formatPrice(item.price, 1)
      }, $options.formatPrice(item.price, 1) ? {
        f: common_vendor.t($options.formatPrice(item.price, 1))
      } : {}, {
        g: common_vendor.t(item.originalPrice),
        h: common_vendor.o(($event) => $options.onGoodsItem(item), index),
        i: index
      });
    }),
    k: $data.statusBarBottom + 50 + "px",
    l: common_vendor.p({
      flagStr: "home"
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/ShopDetails/ShopDetails.js.map
