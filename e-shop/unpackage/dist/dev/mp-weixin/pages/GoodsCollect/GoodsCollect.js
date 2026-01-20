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
    a: common_assets._imports_0$2,
    b: common_vendor.o((...args) => $options.onBack && $options.onBack(...args)),
    c: common_vendor.t($data.isEdit ? "完成" : "编辑"),
    d: common_vendor.o(($event) => $data.isEdit = !$data.isEdit),
    e: 50 + $data.statusBarHeight + "px",
    f: $data.statusBarHeight + "px",
    g: common_vendor.f($data.goodsList, (item, index, i0) => {
      return common_vendor.e($data.isEdit ? {
        a: common_assets._imports_1$6
      } : {}, {
        b: item.pic,
        c: common_vendor.t(item.name),
        d: common_vendor.t(item.price),
        e: index
      });
    }),
    h: $data.isEdit,
    i: 60 + $data.statusBarHeight + "px",
    j: $data.isEdit
  }, $data.isEdit ? {
    k: common_assets._imports_1$6,
    l: $data.statusBarBottom + "px"
  } : {}, {
    m: common_vendor.sei(common_vendor.gei(_ctx, ""), "view"),
    n: $data.statusBarBottom + 50 + "px"
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/GoodsCollect/GoodsCollect.js.map
