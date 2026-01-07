"use strict";
const common_vendor = require("../../common/vendor.js");
const mock_goodsData = require("../../mock/goodsData.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = common_vendor.defineComponent({
  data() {
    return {
      statusBarHeight: 0,
      statusBarBottom: 0,
      isEdit: false,
      goodsList: mock_goodsData.goodsData
    };
  },
  onLoad() {
    let windowInfo = common_vendor.index.getWindowInfo();
    this.statusBarHeight = windowInfo.statusBarHeight;
    this.statusBarBottom = windowInfo.safeAreaInsets.bottom;
  },
  methods: {
    onBack() {
      common_vendor.index.navigateBack();
    }
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  "raw js";
  return common_vendor.e({
    a: common_assets._imports_0$3,
    b: common_vendor.o((...args) => $options.onBack && $options.onBack(...args)),
    c: common_vendor.t($data.isEdit ? "完成" : "编辑"),
    d: common_vendor.o(($event) => $data.isEdit = !$data.isEdit),
    e: 50 + $data.statusBarHeight + "px",
    f: $data.statusBarHeight + "px",
    g: common_vendor.f(10, (item, index, i0) => {
      return common_vendor.e($data.isEdit ? {
        a: common_assets._imports_1$6
      } : {}, {
        b: common_vendor.t(item),
        c: common_vendor.f($data.goodsList, (item2, k1, i1) => {
          return {
            a: item2.pic,
            b: item2.id
          };
        }),
        d: index
      });
    }),
    h: $data.isEdit,
    i: common_assets._imports_0$6,
    j: common_assets._imports_1$7,
    k: common_assets._imports_1$7,
    l: common_assets._imports_1$7,
    m: common_assets._imports_1$7,
    n: common_assets._imports_2$4,
    o: 60 + $data.statusBarHeight + "px",
    p: $data.isEdit
  }, $data.isEdit ? {
    q: common_assets._imports_1$6,
    r: $data.statusBarBottom + "px"
  } : {}, {
    s: common_vendor.sei(common_vendor.gei(_ctx, ""), "view"),
    t: $data.statusBarBottom + 50 + "px"
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/ShopCollect/ShopCollect.js.map
