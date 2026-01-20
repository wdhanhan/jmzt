"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const AttrPopup = () => "./components/AttrPopup/AttrPopup.js";
const _sfc_main = common_vendor.defineComponent({
  components: {
    AttrPopup
  },
  data() {
    return {
      statusBarHeight: 0,
      screenWidth: 0,
      bannerCurrent: 0,
      scrollTop: 0,
      pageScrollTop: 0,
      headCut: 0,
      goodsId: 0,
      info: new UTSJSONObject({ images: [], skus: [] })
    };
  },
  computed: {
    // 显示价格：优先用第一个 SKU 的价格，没有就用商品 price
    displayPrice() {
      if (this.info.skus && this.info.skus.length > 0) {
        return this.info.skus[0].price;
      }
      return this.info.price || 0;
    }
  },
  onLoad(options) {
    const w = common_vendor.index.getWindowInfo();
    this.statusBarHeight = w.statusBarHeight;
    this.screenWidth = w.screenWidth;
    this.goodsId = Number(options.goodsId || 0);
    this.getData();
  },
  methods: {
    onBack() {
      common_vendor.index.navigateBack();
    },
    // ⭐ 拨打客服电话
    onCallService() {
      common_vendor.index.makePhoneCall({
        phoneNumber: "0939-5959039",
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/GoodsDetail/GoodsDetail.uvue:228", "拨打电话失败：", err);
          common_vendor.index.showToast({
            title: "无法发起电话",
            icon: "none"
          });
        }
      });
    },
    // 拉取后端商品详情（你自己的 Node 接口）
    getData() {
      common_vendor.index.request({
        url: `https://wdxwhdglzx.jzzw-tech.cn/api/products/${this.goodsId}`,
        method: "GET",
        success: (res) => {
          const data = res.data.data || {};
          this.info = Object.assign(Object.assign({}, data), { images: data.images || [] });
        }
      });
    },
    onPageScroll(e = null) {
      const top = e.detail.scrollTop;
      this.pageScrollTop = Math.min(top / 100, 1);
      if (top <= 50)
        this.headCut = 0;
    },
    onScrollView(type = null) {
      this.headCut = type;
      if (type === 0)
        this.scrollTop = 0;
    },
    changeBanner(e = null) {
      this.bannerCurrent = e.detail.current;
    },
    /** 🔥 弹起 SKU 组件 */
    openPopup(type = null) {
      if (this.$refs.AttrPopup && this.$refs.AttrPopup.$callMethod) {
        this.$refs.AttrPopup.$callMethod("open", type);
      } else {
        common_vendor.index.__f__("warn", "at pages/GoodsDetail/GoodsDetail.uvue:273", "AttrPopup 实例上没有 $callMethod，检查 AttrPopup 是否为 uvue / uts 组件");
      }
    },
    onToShop() {
      common_vendor.index.showToast({ title: "暂未实现", icon: "none" });
    }
  }
});
if (!Array) {
  const _component_attr_popup = common_vendor.resolveComponent("attr-popup");
  _component_attr_popup();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  "raw js";
  return {
    a: common_assets._imports_0$3,
    b: common_vendor.o((...args) => $options.onBack && $options.onBack(...args)),
    c: $data.headCut === 0 ? 1 : "",
    d: common_vendor.o(($event) => $options.onScrollView(0)),
    e: $data.headCut === 1 ? 1 : "",
    f: common_vendor.o(($event) => $options.onScrollView(1)),
    g: $data.headCut === 2 ? 1 : "",
    h: common_vendor.o(($event) => $options.onScrollView(2)),
    i: $data.headCut === 3 ? 1 : "",
    j: common_vendor.o(($event) => $options.onScrollView(3)),
    k: common_assets._imports_1$4,
    l: common_assets._imports_1$5,
    m: $data.statusBarHeight + 50 + "px",
    n: $data.statusBarHeight + "px",
    o: $data.pageScrollTop,
    p: common_assets._imports_0$4,
    q: $data.pageScrollTop <= 0,
    r: common_vendor.o((...args) => $options.onBack && $options.onBack(...args)),
    s: common_assets._imports_4$1,
    t: common_assets._imports_2$3,
    v: $data.pageScrollTop <= 0,
    w: $data.statusBarHeight + 50 + "px",
    x: $data.statusBarHeight + "px",
    y: common_vendor.f($data.info.images, (img, index, i0) => {
      return {
        a: img,
        b: index
      };
    }),
    z: common_vendor.o((...args) => $options.changeBanner && $options.changeBanner(...args)),
    A: common_vendor.f($data.info.images, (img, index, i0) => {
      return {
        a: index,
        b: $data.bannerCurrent === index ? 1 : ""
      };
    }),
    B: $data.screenWidth + "px",
    C: common_vendor.t($options.displayPrice),
    D: common_vendor.t($data.info.name),
    E: common_vendor.t($data.info.description),
    F: common_vendor.f($data.info.images, (img, index, i0) => {
      return {
        a: index,
        b: img
      };
    }),
    G: common_vendor.sei("r0-69941dc7", "view", "goodsDetail"),
    H: $data.statusBarHeight + 50 + "px",
    I: $data.scrollTop,
    J: common_vendor.o((...args) => $options.onPageScroll && $options.onPageScroll(...args)),
    K: common_assets._imports_6,
    L: common_vendor.o((...args) => $options.onCallService && $options.onCallService(...args)),
    M: common_vendor.o(($event) => $options.openPopup("cart")),
    N: common_vendor.o(($event) => $options.openPopup("buy")),
    O: common_vendor.sr("AttrPopup", "69941dc7-0"),
    P: common_vendor.p({
      info: $data.info
    }),
    Q: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
_sfc_main.__runtimeHooks = 1;
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/GoodsDetail/GoodsDetail.js.map
