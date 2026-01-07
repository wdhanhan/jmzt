"use strict";
const common_vendor = require("../../common/vendor.js");
const mock_classifyData = require("../../mock/classifyData.js");
const mock_goodsData = require("../../mock/goodsData.js");
const _sfc_main = common_vendor.defineComponent({
  data() {
    return {
      classifyList: mock_classifyData.ClassifyData,
      dayGoods: mock_goodsData.dayData,
      goodsList: mock_goodsData.goodsData
    };
  },
  onLoad(options) {
    const title = options.get("title");
    common_vendor.index.setNavigationBarTitle({
      title
    });
    this.getData();
  },
  methods: {
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
    getData() {
      this.classifyList = [];
      this.classifyList = mock_classifyData.ClassifyData[0].children[0].children;
      this.classifyList = [...this.classifyList, ...mock_classifyData.ClassifyData[0].children[1].children];
      this.classifyList = [...this.classifyList, ...mock_classifyData.ClassifyData[1].children[0].children];
    },
    /**
     * 商品点击
     */
    onGoodsItem(item) {
      common_vendor.index.navigateTo({
        url: `/pages/GoodsDetail/GoodsDetail?goodsId=${item.id}`
      });
    },
    /**
     * 分类点击
     */
    onClassify() {
      common_vendor.index.navigateTo({
        url: `/pages/SearchGoods/SearchGoods`
      });
    }
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  "raw js";
  return {
    a: common_vendor.f($data.classifyList, (item, index, i0) => {
      return {
        a: item.pic,
        b: common_vendor.t(item.name),
        c: common_vendor.o((...args) => $options.onClassify && $options.onClassify(...args), index),
        d: index
      };
    }),
    b: common_vendor.f($data.dayGoods, (item, index, i0) => {
      return {
        a: item.pic,
        b: common_vendor.t(item.price),
        c: common_vendor.o(($event) => $options.onGoodsItem(item), index),
        d: index
      };
    }),
    c: common_vendor.f($data.goodsList, (item, index, i0) => {
      return common_vendor.e({
        a: item.pic,
        b: common_vendor.t(item.name),
        c: common_vendor.t($options.formatPrice(item.price, 0)),
        d: $options.formatPrice(item.price, 1)
      }, $options.formatPrice(item.price, 1) ? {
        e: common_vendor.t($options.formatPrice(item.price, 1))
      } : {}, {
        f: common_vendor.o(($event) => $options.onGoodsItem(item), index),
        g: index
      });
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/ClassifyGoods/ClassifyGoods.js.map
