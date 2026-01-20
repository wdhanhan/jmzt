"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _component_uni_icons = common_vendor.resolveComponent("uni-icons");
  _component_uni_icons();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "vip",
  setup(__props) {
    const productConfig = new UTSJSONObject({
      // light_month: { price: 4.9, desc: '轻月卡 (纯资格费)' },
      // heavy_month: { price: 99, desc: '重月卡 (充值99送会员)' },
      // times_year: { price: 68, desc: '分次年卡 (余额分12次返)' },
      // free_year: { price: 199, desc: '自由年卡 (充值199送会员)' }
      light_month: new UTSJSONObject({ price: 0.01, desc: "轻月卡 (纯资格费)" }),
      heavy_month: new UTSJSONObject({ price: 0.01, desc: "重月卡 (充值99送会员)" }),
      times_year: new UTSJSONObject({ price: 0.01, desc: "分次年卡 (余额分12次返)" }),
      free_year: new UTSJSONObject({ price: 0.01, desc: "自由年卡 (充值199送会员)" })
    });
    const goToPay = (type = null) => {
      const item = productConfig[type];
      if (!item)
        return null;
      const url = `/pages/chongzhi/chongzhi?type=${type}&amount=${item.price}&desc=${encodeURIComponent(item.desc)}`;
      common_vendor.index.navigateTo({ url });
    };
    return (_ctx, _cache) => {
      "raw js";
      const __returned__ = {
        a: common_vendor.p({
          type: "vip-filled",
          size: "24",
          color: "#F0D3A6"
        }),
        b: common_vendor.o(($event) => {
          return goToPay("light_month");
        }),
        c: common_vendor.o(($event) => {
          return goToPay("heavy_month");
        }),
        d: common_vendor.o(($event) => {
          return goToPay("times_year");
        }),
        e: common_vendor.o(($event) => {
          return goToPay("free_year");
        }),
        f: common_vendor.p({
          type: "checkbox-filled",
          color: "#666",
          size: "14"
        }),
        g: common_vendor.p({
          type: "checkbox-filled",
          color: "#666",
          size: "14"
        }),
        h: common_vendor.p({
          type: "checkbox-filled",
          color: "#666",
          size: "14"
        }),
        i: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
      };
      return __returned__;
    };
  }
});
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/vip/vip.js.map
