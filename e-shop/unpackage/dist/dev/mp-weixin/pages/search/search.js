"use strict";
const common_vendor = require("../../common/vendor.js");
const common_way = require("../../common/way.js");
const common_assets = require("../../common/assets.js");
class hotKeywordItem extends UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          keyword: { type: String, optional: false },
          sort: { type: Number, optional: false }
        };
      },
      name: "hotKeywordItem"
    };
  }
  constructor(options, metadata = hotKeywordItem.get$UTSMetadata$(), isJSONParse = false) {
    super();
    this.__props__ = UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.keyword = this.__props__.keyword;
    this.sort = this.__props__.sort;
    delete this.__props__;
  }
}
const _sfc_main = common_vendor.defineComponent({
  data() {
    return {};
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
     * 搜索点击
     */
    onSearch() {
      if (this.keyword === "") {
        common_way.toast("请输入搜索内容");
        return null;
      }
      common_vendor.index.navigateTo({
        url: `/pages/SearchGoods/SearchGoods?keyword=${this.keyword}`
      });
    },
    /**
     * 历史热词点击
     * @param value
     */
    onKeyword(value) {
      common_vendor.index.navigateTo({
        url: `/pages/SearchGoods/SearchGoods?keyword=${value}`
      });
    }
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  "raw js";
  return {
    a: common_assets._imports_0$2,
    b: common_vendor.o((...args) => $options.onBack && $options.onBack(...args)),
    c: common_assets._imports_1$3,
    d: _ctx.keyword,
    e: common_vendor.o(($event) => _ctx.keyword = $event.detail.value),
    f: common_vendor.o((...args) => $options.onSearch && $options.onSearch(...args)),
    g: _ctx.statusBarHeight + 50 + "px",
    h: _ctx.statusBarHeight + "px",
    i: common_vendor.f(_ctx.historyList, (item, index, i0) => {
      return {
        a: common_vendor.t(item),
        b: common_vendor.o(($event) => $options.onKeyword(item), index),
        c: index
      };
    }),
    j: common_vendor.f(_ctx.hotKeywordList, (item, index, i0) => {
      return {
        a: common_vendor.t(item.sort),
        b: common_vendor.t(item.keyword),
        c: common_vendor.o(($event) => $options.onKeyword(item.keyword), index),
        d: index
      };
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/search/search.js.map
