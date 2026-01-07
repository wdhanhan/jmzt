"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = common_vendor.defineComponent({
  data() {
    return {
      oneClassifyList: [],
      allProducts: [],
      productList: [],
      oneClassifyId: 0
      // 当前选中的分类 id
    };
  },
  onLoad() {
    return common_vendor.__awaiter(this, void 0, void 0, function* () {
      yield this.loadCategories();
      yield this.loadProducts();
      this.refreshProducts();
    });
  },
  methods: {
    // 加载分类列表
    loadCategories() {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        const res = yield common_vendor.index.request({
          url: "https://wdxwhdglzx.jzzw-tech.cn/api/categories/list"
        });
        const list = res.data.data || [];
        this.oneClassifyList = list.sort((a = null, b = null) => {
          return a.sort_order - b.sort_order;
        });
        if (this.oneClassifyList.length) {
          this.oneClassifyId = this.oneClassifyList[0].id;
        }
      });
    },
    // 加载商品列表
    loadProducts() {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        const res = yield common_vendor.index.request({
          url: "https://wdxwhdglzx.jzzw-tech.cn/api/products/list"
        });
        const list = res.data.data || [];
        this.allProducts = list.map((p = null) => {
          let price = "0.00";
          if (p.skus && p.skus.length) {
            const min = p.skus.reduce((pre = null, cur = null) => {
              const prePrice = parseFloat(pre.price || pre);
              const curPrice = parseFloat(cur.price);
              return prePrice < curPrice ? prePrice : curPrice;
            }, p.skus[0].price);
            price = Number(min).toFixed(2);
          }
          return new UTSJSONObject({
            id: p.id,
            name: p.name,
            pic: p.images && p.images[0] || "",
            price,
            category_id: p.category_id
          });
        });
      });
    },
    // 根据当前选中分类，刷新右侧商品列表
    refreshProducts() {
      this.productList = this.allProducts.filter((p) => {
        return p.category_id === this.oneClassifyId;
      });
    },
    // 点击左侧分类
    onOneClassify(id = null) {
      this.oneClassifyId = id;
      this.refreshProducts();
    },
    onGoodsClick(goods = null) {
      common_vendor.index.navigateTo({
        url: `/pages/GoodsDetail/GoodsDetail?goodsId=${goods.id}`
      });
    }
  }
});
if (!Array) {
  const _easycom_page2 = common_vendor.resolveComponent("page");
  _easycom_page2();
}
const _easycom_page = () => "../../components/page/page.js";
if (!Math) {
  _easycom_page();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  "raw js";
  return common_vendor.e({
    a: common_vendor.f($data.oneClassifyList, (item, k0, i0) => {
      return {
        a: $data.oneClassifyId === item.id ? 1 : "",
        b: common_vendor.t(item.name),
        c: $data.oneClassifyId === item.id ? 1 : "",
        d: item.id,
        e: $data.oneClassifyId === item.id ? 1 : "",
        f: common_vendor.o(($event) => $options.onOneClassify(item.id), item.id)
      };
    }),
    b: common_vendor.f($data.productList, (goods, k0, i0) => {
      return {
        a: goods.pic,
        b: common_vendor.t(goods.name),
        c: common_vendor.t(goods.price),
        d: goods.id,
        e: common_vendor.o(($event) => $options.onGoodsClick(goods), goods.id)
      };
    }),
    c: !$data.productList.length
  }, !$data.productList.length ? {} : {}, {
    d: common_vendor.gei(_ctx, ""),
    e: common_vendor.p({
      id: common_vendor.gei(_ctx, "")
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/classify/classify.js.map
