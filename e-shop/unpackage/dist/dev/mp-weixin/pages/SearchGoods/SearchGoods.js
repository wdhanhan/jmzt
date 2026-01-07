"use strict";
const common_vendor = require("../../common/vendor.js");
const mock_goodsData = require("../../mock/goodsData.js");
const common_assets = require("../../common/assets.js");
const CatPopup = () => "../../components/CatPopup/CatPopup.js";
const _sfc_main = common_vendor.defineComponent({
  components: {
    CatPopup
  },
  data() {
    return {
      statusBarHeight: 0,
      screenHeight: 0,
      goodsCut: 0,
      keyword: "",
      goodsLists: mock_goodsData.goodsData,
      serveCut: 0
    };
  },
  onLoad(options) {
    this.goodsCut = 1;
    const windowInfo = common_vendor.index.getWindowInfo();
    this.statusBarHeight = windowInfo.statusBarHeight;
    this.screenHeight = windowInfo.screenHeight;
    this.keyword = options.get("keyword") === null ? "" : options.get("keyword");
  },
  methods: {
    /**
     * 返回点击
     */
    onBack() {
      common_vendor.index.navigateBack();
    },
    /**
     * 商品列表切换点击
     */
    onGoodCut() {
      this.goodsCut = this.goodsCut === 1 ? 0 : 1;
    },
    /**
     * 筛选点击
     */
    onFiltrate() {
      this.$refs["CatPopup"].$callMethod("open");
    },
    /**
     * 筛选服务点击
     * @param type
     */
    onFiltrateServe(type) {
      this.serveCut = type;
    },
    /**
     * 商品点击
     * @param item
     */
    onGoodsItem(item) {
      common_vendor.index.navigateTo({
        url: `/pages/GoodsDetail/GoodsDetail?goodsId=${item.id}`
      });
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
    }
  }
});
if (!Array) {
  const _component_cat_popup = common_vendor.resolveComponent("cat-popup");
  _component_cat_popup();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  "raw js";
  return {
    a: common_assets._imports_0$3,
    b: common_vendor.o((...args) => $options.onBack && $options.onBack(...args)),
    c: common_assets._imports_1$3,
    d: $data.keyword,
    e: common_vendor.o(($event) => $data.keyword = $event.detail.value),
    f: $data.statusBarHeight + 50 + "px",
    g: $data.statusBarHeight + "px",
    h: common_assets._imports_2$1,
    i: common_assets._imports_2$2,
    j: common_vendor.o((...args) => $options.onFiltrate && $options.onFiltrate(...args)),
    k: common_assets._imports_4$1,
    l: $data.goodsCut === 0,
    m: common_assets._imports_5,
    n: $data.goodsCut === 1,
    o: common_vendor.o((...args) => $options.onGoodCut && $options.onGoodCut(...args)),
    p: $data.statusBarHeight + 50 + "px",
    q: common_vendor.f($data.goodsLists, (item, index, i0) => {
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
        h: common_vendor.t(item.shopName),
        i: common_vendor.o(($event) => $options.onGoodsItem(item), index),
        j: index
      });
    }),
    r: common_assets._imports_1$1,
    s: $data.goodsCut === 0,
    t: common_vendor.f($data.goodsLists, (item, index, i0) => {
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
        h: common_vendor.t(item.shopName),
        i: common_vendor.o(($event) => $options.onGoodsItem(item), index),
        j: index
      });
    }),
    v: common_assets._imports_1$1,
    w: $data.goodsCut === 1,
    x: $data.goodsCut === 1 ? "#f8f8f8" : "#ffffff",
    y: $data.statusBarHeight + 100 + "px",
    z: $data.statusBarHeight + 90 + "px",
    A: $data.serveCut === 0 ? 1 : "",
    B: $data.serveCut === 0 ? 1 : "",
    C: common_vendor.o(($event) => $options.onFiltrateServe(0)),
    D: $data.serveCut === 1 ? 1 : "",
    E: $data.serveCut === 1 ? 1 : "",
    F: common_vendor.o(($event) => $options.onFiltrateServe(1)),
    G: $data.serveCut === 2 ? 1 : "",
    H: $data.serveCut === 2 ? 1 : "",
    I: common_vendor.o(($event) => $options.onFiltrateServe(2)),
    J: $data.statusBarHeight,
    K: $data.screenHeight + "px",
    L: common_vendor.sr("CatPopup", "5d1c2b38-0"),
    M: common_vendor.p({
      mode: "right"
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/SearchGoods/SearchGoods.js.map
