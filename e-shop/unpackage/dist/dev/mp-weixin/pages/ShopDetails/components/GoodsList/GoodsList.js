"use strict";
const common_vendor = require("../../../../common/vendor.js");
const mock_goodsData = require("../../../../mock/goodsData.js");
const common_assets = require("../../../../common/assets.js");
const _sfc_main = common_vendor.defineComponent({
  data() {
    return {
      statusBarHeight: 0,
      statusBarBottom: 0,
      goodsList: mock_goodsData.goodsData
    };
  },
  props: {
    isSearch: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    let windowInfo = common_vendor.index.getWindowInfo();
    this.statusBarHeight = windowInfo.statusBarHeight;
    this.statusBarBottom = windowInfo.safeAreaInsets.bottom;
  },
  methods: {
    onBack() {
      common_vendor.index.navigateBack();
    },
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
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  "raw js";
  return common_vendor.e({
    a: $props.isSearch
  }, $props.isSearch ? {
    b: common_assets._imports_0$3,
    c: common_vendor.o((...args) => $options.onBack && $options.onBack(...args)),
    d: common_assets._imports_1$3,
    e: $data.statusBarHeight + 50 + "px",
    f: $data.statusBarHeight + "px"
  } : {}, {
    g: common_assets._imports_2$2,
    h: $props.isSearch ? $data.statusBarHeight + 50 + "px" : 0,
    i: common_vendor.f($data.goodsList, (item, index, i0) => {
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
    j: $data.statusBarBottom + 50 + "px",
    k: $props.isSearch ? $data.statusBarHeight + 50 + "px" : 0
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/pages/ShopDetails/components/GoodsList/GoodsList.js.map
