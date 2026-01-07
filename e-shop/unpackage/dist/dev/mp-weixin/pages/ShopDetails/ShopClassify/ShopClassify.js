"use strict";
const common_vendor = require("../../../common/vendor.js");
const mock_classifyData = require("../../../mock/classifyData.js");
const ShopTabNar = () => "../components/ShopTabNar/ShopTabNar.js";
const _sfc_main = common_vendor.defineComponent({
  components: { ShopTabNar },
  data() {
    return {
      statusBarHeight: 0,
      statusBarBottom: 0,
      oneClassifyList: [],
      classifyList: [],
      // 一级分类id
      oneClassifyId: 0
    };
  },
  onLoad() {
    let windowInfo = common_vendor.index.getWindowInfo();
    this.statusBarHeight = windowInfo.statusBarHeight;
    this.statusBarBottom = windowInfo.safeAreaInsets.bottom;
    this.getData();
  },
  methods: {
    getData() {
      this.oneClassifyId = mock_classifyData.ClassifyData[0].id;
      for (let i = 0; i < mock_classifyData.ClassifyData.length; i++) {
        this.oneClassifyList.push(mock_classifyData.ClassifyData[i]);
        for (let j = 0; j < mock_classifyData.ClassifyData[i].children.length; j++) {
          if (this.oneClassifyId === mock_classifyData.ClassifyData[i].children[j].parent) {
            this.classifyList.push(mock_classifyData.ClassifyData[i].children[j]);
          }
        }
      }
    },
    /**
     * 一级分类点击
     * @param id
     * @param index
     */
    onOneClassify(id, index) {
      this.oneClassifyId = id;
      this.classifyList = this.oneClassifyList[index].children;
    },
    /**
     * 分类点击
     */
    onClassify() {
      common_vendor.index.navigateTo({
        url: "/pages/ShopDetails/ShopGoodsResult/ShopGoodsResult"
      });
    }
  }
});
if (!Array) {
  const _component_shop_tab_nar = common_vendor.resolveComponent("shop-tab-nar");
  const _easycom_page2 = common_vendor.resolveComponent("page");
  (_component_shop_tab_nar + _easycom_page2)();
}
const _easycom_page = () => "../../../components/page/page.js";
if (!Math) {
  _easycom_page();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  "raw js";
  return {
    a: common_vendor.f($data.oneClassifyList, (item, index, i0) => {
      return {
        a: $data.oneClassifyId === item.id ? 1 : "",
        b: common_vendor.t(item.name),
        c: $data.oneClassifyId === item.id ? 1 : "",
        d: $data.oneClassifyId === item.id ? 1 : "",
        e: common_vendor.o(($event) => $options.onOneClassify(item.id, index), index),
        f: index
      };
    }),
    b: common_vendor.f($data.classifyList, (item, index, i0) => {
      return {
        a: common_vendor.t(item.name),
        b: common_vendor.f(item.children, (value, idx, i1) => {
          return {
            a: value.pic,
            b: common_vendor.t(value.name),
            c: common_vendor.o((...args) => $options.onClassify && $options.onClassify(...args), idx),
            d: idx
          };
        }),
        c: index
      };
    }),
    c: $data.statusBarBottom + 50 + "px",
    d: common_vendor.p({
      flagStr: "class"
    }),
    e: common_vendor.gei(_ctx, ""),
    f: common_vendor.p({
      id: common_vendor.gei(_ctx, "")
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/ShopDetails/ShopClassify/ShopClassify.js.map
