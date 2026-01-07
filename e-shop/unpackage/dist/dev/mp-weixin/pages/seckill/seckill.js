"use strict";
const common_vendor = require("../../common/vendor.js");
const mock_goodsData = require("../../mock/goodsData.js");
const mock_bannerData = require("../../mock/bannerData.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = common_vendor.defineComponent({
  data() {
    return {
      statusBarHeight: 0,
      pageScrollTop: 0,
      sessionCut: 0,
      seckillList: mock_goodsData.seckillGoodsData,
      bannerList: mock_bannerData.BannerData
    };
  },
  onLoad() {
    let windowInfo = common_vendor.index.getWindowInfo();
    this.statusBarHeight = windowInfo.statusBarHeight;
  },
  methods: {
    /**
     * 返回点击
     */
    onBack() {
      common_vendor.index.navigateBack();
    },
    /**
     * 页面滑动事件
     * @param e
     */
    onPageScroll(e) {
      let scrollTop = e.detail.scrollTop;
      let top = scrollTop / 100;
      this.pageScrollTop = top;
      if (top >= 1) {
        this.pageScrollTop = 1;
      }
    },
    /**
     * 数量计算
     * @param count
     * @param useCount
     * @param type
     */
    calculateNumber(count, useCount, type) {
      let sum = count - useCount;
      let bar = useCount / count * 100;
      return type === 0 ? sum : Math.round(bar * 100) / 100;
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
     * @param item
     */
    onGoodsItem(item) {
      common_vendor.index.navigateTo({
        url: `/pages/GoodsDetail/GoodsDetail?goodsId=${item.id}`
      });
    },
    /**
     * 场次切换点击
     * @param type
     */
    onSessionCut(type) {
      this.sessionCut = type;
    }
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  "raw js";
  return {
    a: common_assets._imports_0$5,
    b: common_vendor.o((...args) => $options.onBack && $options.onBack(...args)),
    c: common_assets._imports_1$8,
    d: common_assets._imports_2$3,
    e: $data.statusBarHeight + 50 + "px",
    f: $data.statusBarHeight + "px",
    g: "rgba(231,45,30," + $data.pageScrollTop + ")",
    h: common_vendor.f($data.bannerList, (item, index, i0) => {
      return {
        a: item.pic,
        b: index
      };
    }),
    i: $data.statusBarHeight + 60 + "px",
    j: $data.sessionCut === 0 ? 1 : "",
    k: $data.sessionCut === 0 ? 1 : "",
    l: $data.sessionCut === 0 ? 1 : "",
    m: common_vendor.o(($event) => $options.onSessionCut(0)),
    n: $data.sessionCut === 1 ? 1 : "",
    o: $data.sessionCut === 1 ? 1 : "",
    p: $data.sessionCut === 1 ? 1 : "",
    q: common_vendor.o(($event) => $options.onSessionCut(1)),
    r: $data.sessionCut === 2 ? 1 : "",
    s: $data.sessionCut === 2 ? 1 : "",
    t: $data.sessionCut === 2 ? 1 : "",
    v: common_vendor.o(($event) => $options.onSessionCut(2)),
    w: $data.sessionCut === 3 ? 1 : "",
    x: $data.sessionCut === 3 ? 1 : "",
    y: $data.sessionCut === 3 ? 1 : "",
    z: common_vendor.o(($event) => $options.onSessionCut(3)),
    A: common_vendor.f($data.seckillList, (item, index, i0) => {
      return common_vendor.e({
        a: item.pic,
        b: common_vendor.t(item.name),
        c: $options.calculateNumber(item.inventory, item.salesVolume, 1) >= 40
      }, $options.calculateNumber(item.inventory, item.salesVolume, 1) >= 40 ? {
        d: common_vendor.t($options.calculateNumber(item.inventory, item.salesVolume, 0))
      } : {}, {
        e: $options.calculateNumber(item.inventory, item.salesVolume, 1) + "%",
        f: common_vendor.t($options.formatPrice(item.price, 0)),
        g: $options.formatPrice(item.price, 1)
      }, $options.formatPrice(item.price, 1) ? {
        h: common_vendor.t($options.formatPrice(item.price, 1))
      } : {}, {
        i: common_vendor.t(item.originalPrice),
        j: common_vendor.o(($event) => $options.onGoodsItem(item), index),
        k: index
      });
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/seckill/seckill.js.map
