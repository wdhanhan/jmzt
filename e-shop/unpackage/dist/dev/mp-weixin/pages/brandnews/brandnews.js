"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = common_vendor.defineComponent({
  data() {
    return {
      statusBarHeight: 0,
      // 编造的美味菜单数据
      dishes: [
        new UTSJSONObject({
          name: "松茸鲜肉饺",
          tag: "桌桌必点",
          img: "https://images.unsplash.com/photo-1625243179244-6725350c337d?q=80&w=1000&auto=format&fit=crop"
        }),
        new UTSJSONObject({
          name: "虾仁三鲜饺",
          tag: "整颗大虾",
          img: "https://images.unsplash.com/photo-1559183533-eb86b72d0758?q=80&w=1000&auto=format&fit=crop"
        }),
        new UTSJSONObject({
          name: "酸汤水饺",
          tag: "开胃神器",
          img: "https://images.unsplash.com/photo-1604152135912-04a022e23696?q=80&w=1000&auto=format&fit=crop"
        }),
        new UTSJSONObject({
          name: "秘制酱大骨",
          tag: "下酒绝配",
          img: "https://images.unsplash.com/photo-1544025162-d76690b6d029?q=80&w=1000&auto=format&fit=crop"
        })
      ]
    };
  },
  onLoad() {
    const windowInfo = common_vendor.index.getWindowInfo();
    this.statusBarHeight = windowInfo.statusBarHeight;
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  "raw js";
  return {
    a: $data.statusBarHeight + "px",
    b: common_vendor.f($data.dishes, (item, index, i0) => {
      return {
        a: item.img,
        b: common_vendor.t(item.name),
        c: common_vendor.t(item.tag),
        d: index
      };
    }),
    c: common_vendor.sei(common_vendor.gei(_ctx, ""), "scroll-view")
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/brandnews/brandnews.js.map
