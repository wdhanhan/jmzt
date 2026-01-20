"use strict";
const common_vendor = require("../../common/vendor.js");
const mock_couponData = require("../../mock/couponData.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = common_vendor.defineComponent({
  data() {
    return {
      statusBarHeight: 0,
      statusBarBottom: 0,
      status: 1,
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
     * tab点击
     * @param status
     */
    onTab(status) {
      this.status = status;
    }
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  "raw js";
  return {
    a: $data.status === 1 ? 1 : "",
    b: $data.status === 1 ? 1 : "",
    c: common_vendor.o(($event) => $options.onTab(1)),
    d: $data.status === 2 ? 1 : "",
    e: $data.status === 2 ? 1 : "",
    f: common_vendor.o(($event) => $options.onTab(2)),
    g: $data.status === 3 ? 1 : "",
    h: $data.status === 3 ? 1 : "",
    i: common_vendor.o(($event) => $options.onTab(3)),
    j: common_vendor.f($data.couponList, (item, index, i0) => {
      return {
        a: common_vendor.t(item.title),
        b: common_vendor.t(item.startDate),
        c: common_vendor.t(item.endDate),
        d: $data.moreIndex !== index,
        e: $data.moreIndex == index,
        f: common_vendor.o(($event) => $options.onMore(index), index),
        g: common_vendor.t(item.subPrice),
        h: common_vendor.t(item.fullPrice),
        i: $data.moreIndex === index,
        j: index
      };
    }),
    k: common_assets._imports_0$7,
    l: common_assets._imports_1$10,
    m: $data.status === 1,
    n: common_assets._imports_2$6,
    o: $data.status === 2,
    p: common_assets._imports_3$3,
    q: $data.status === 3,
    r: common_assets._imports_4$3,
    s: common_assets._imports_5$2
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/CouponUseRecord/CouponUseRecord.js.map
