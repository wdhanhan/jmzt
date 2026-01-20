"use strict";
const common_vendor = require("../../common/vendor.js");
const mock_couponData = require("../../mock/couponData.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = common_vendor.defineComponent({
  data() {
    return {
      statusBarHeight: 0,
      statusBarBottom: 0,
      moreIndex: -1,
      couponList: mock_couponData.CouponData
    };
  },
  onLoad() {
    let windowInfo = common_vendor.index.getWindowInfo();
    this.statusBarHeight = windowInfo.statusBarHeight;
    this.statusBarBottom = windowInfo.safeAreaInsets.bottom;
  },
  methods: {
    onMore(index) {
      this.moreIndex = index;
    },
    /**
     * 优惠券使用记录点击
     */
    onToRecord() {
      common_vendor.index.navigateTo({
        url: "/pages/CouponUseRecord/CouponUseRecord"
      });
    },
    /**
     * 领取中心点击
     */
    onToCouponCenter() {
      common_vendor.index.navigateTo({
        url: "/pages/CouponCenter/CouponCenter"
      });
    }
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  "raw js";
  return {
    a: common_vendor.f($data.couponList, (item, index, i0) => {
      return {
        a: common_vendor.t(item.title),
        b: common_vendor.t(item.endDate),
        c: $data.moreIndex !== index,
        d: $data.moreIndex === index,
        e: common_vendor.o(($event) => $options.onMore(index), index),
        f: common_vendor.t(item.subPrice),
        g: common_vendor.t(item.fullPrice),
        h: $data.moreIndex === index,
        i: index
      };
    }),
    b: common_assets._imports_0$6,
    c: common_assets._imports_4$3,
    d: common_assets._imports_5$2,
    e: common_vendor.o((...args) => $options.onToRecord && $options.onToRecord(...args)),
    f: common_vendor.o((...args) => $options.onToCouponCenter && $options.onToCouponCenter(...args)),
    g: $data.statusBarBottom + "px",
    h: common_vendor.sei(common_vendor.gei(_ctx, ""), "view"),
    i: $data.statusBarBottom + 50 + "px"
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/MyCoupon/MyCoupon.js.map
