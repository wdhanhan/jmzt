"use strict";
const common_vendor = require("../../../../common/vendor.js");
const common_assets = require("../../../../common/assets.js");
const CatPopup = () => "../../../../components/CatPopup/CatPopup.js";
const API_BASE = "https://wdxwhdglzx.jzzw-tech.cn";
const _sfc_main = common_vendor.defineComponent({
  components: {
    CatPopup
  },
  props: {
    // 直接用后端 /api/products/:id 返回的 data
    info: {
      type: Object,
      default() {
        return new UTSJSONObject({
          id: 0,
          name: "",
          price: 0,
          pic: "",
          images: [],
          skus: []
        });
      }
    }
  },
  data() {
    return {
      statusBarBottom: 0,
      btnType: "",
      selectedSkuIndex: 0,
      quantity: 1
      // 数量
    };
  },
  mounted() {
    const windowInfo = common_vendor.index.getWindowInfo();
    this.statusBarBottom = windowInfo.safeAreaInsets ? windowInfo.safeAreaInsets.bottom : 0;
    if (this.info && this.info.skus && this.info.skus.length > 0) {
      this.selectedSkuIndex = 0;
    }
  },
  computed: {
    // 当前选中的 sku
    currentSku() {
      if (this.info && this.info.skus && this.info.skus.length > 0) {
        return this.info.skus[this.selectedSkuIndex] || new UTSJSONObject({});
      }
      return new UTSJSONObject({});
    },
    // 顶部展示图片：优先 sku.image → info.images[0] → info.pic
    displayPic() {
      if (this.currentSku && this.currentSku.image) {
        return this.currentSku.image;
      }
      if (this.info && this.info.images && this.info.images.length > 0) {
        return this.info.images[0];
      }
      return this.info.pic || "";
    },
    // 顶部展示价格：优先 sku.price → info.price
    displayPrice() {
      if (this.currentSku && this.currentSku.price) {
        return this.currentSku.price;
      }
      return this.info.price || 0;
    },
    // “已选：xxx”
    selectedSkuText() {
      if (!this.info.skus || this.info.skus.length === 0) {
        return "默认规格";
      }
      const sku = this.currentSku;
      if (!sku)
        return "默认规格";
      return sku.sku_name || "默认规格";
    }
  },
  methods: {
    /**
     * 外部调用：打开弹窗
     * type: 'cart' | 'buy'
     */
    open(type = null) {
      this.btnType = type || "buy";
      if (!this.info.skus || this.info.skus.length === 0) {
        this.selectedSkuIndex = 0;
      } else if (this.selectedSkuIndex >= this.info.skus.length) {
        this.selectedSkuIndex = 0;
      }
      this.quantity = 1;
      if (this.$refs.CatPopup && this.$refs.CatPopup.$callMethod) {
        this.$refs.CatPopup.$callMethod("open");
      }
    },
    close() {
      if (this.$refs.CatPopup && this.$refs.CatPopup.$callMethod) {
        this.$refs.CatPopup.$callMethod("close");
      }
    },
    // 选择 SKU
    selectSku(index = null) {
      this.selectedSkuIndex = index;
    },
    // 改数量
    changeQty(delta = null) {
      const next = this.quantity + delta;
      if (next < 1)
        return null;
      this.quantity = next;
    },
    // ⭐⭐ 加入购物车：真正调用 /api/cart/add
    onAddCart() {
      if (!this.currentSku || !this.currentSku.sku_id) {
        common_vendor.index.showToast({ title: "请选择规格", icon: "none" });
        return null;
      }
      const openid = common_vendor.index.getStorageSync("openid");
      if (!openid) {
        common_vendor.index.showToast({ title: "请先登录", icon: "none" });
        return null;
      }
      const skuId = this.currentSku.sku_id;
      const qty = this.quantity;
      common_vendor.index.showLoading({ title: "加入中..." });
      common_vendor.index.request({
        url: `${API_BASE}/api/cart/add`,
        method: "POST",
        header: new UTSJSONObject({
          "content-type": "application/json"
        }),
        data: new UTSJSONObject({
          openid,
          sku_id: skuId,
          quantity: qty
        }),
        success: (res) => {
          const body = res.data || {};
          if (body.code === 200) {
            common_vendor.index.showToast({
              title: body.msg || "已加入购物车",
              icon: "success"
            });
            this.close();
          } else {
            common_vendor.index.showToast({
              title: body.msg || "加入购物车失败",
              icon: "none"
            });
          }
        },
        fail: () => {
          common_vendor.index.showToast({
            title: "网络错误，请稍后重试",
            icon: "none"
          });
        },
        complete: () => {
          common_vendor.index.hideLoading();
        }
      });
    },
    formatSkuName(sku = null, index = null) {
      const name = sku.sku_name || "规格 " + (index + 1);
      return name.replace(/\//g, "");
    },
    // 立即购买
    onBuy() {
      if (!this.currentSku || !this.currentSku.sku_id) {
        common_vendor.index.showToast({ title: "请选择规格", icon: "none" });
        return null;
      }
      const goodsId = this.info.id || 0;
      const sku = this.currentSku;
      const qty = this.quantity;
      const orderItem = new UTSJSONObject({
        product_id: goodsId,
        sku_id: sku.sku_id,
        name: this.info.name,
        sku_name: sku.sku_name || this.selectedSkuText,
        price: sku.price || this.info.price || 0,
        quantity: qty,
        image: sku.image || this.displayPic,
        attr1: sku.attr1,
        attr2: sku.attr2,
        attr3: sku.attr3,
        attr4: sku.attr4
      });
      common_vendor.index.navigateTo({
        url: "/pages/ConfirmOrder/ConfirmOrder",
        success: (res) => {
          const eventChannel = res.eventChannel;
          eventChannel.emit("orderData", new UTSJSONObject({
            items: [orderItem],
            from: "goodsDetail"
          }));
        }
      });
    }
  }
});
if (!Array) {
  const _component_cat_popup = common_vendor.resolveComponent("cat-popup");
  _component_cat_popup();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  "raw js";
  return common_vendor.e({
    a: common_assets._imports_0$10,
    b: common_vendor.o((...args) => $options.close && $options.close(...args)),
    c: $options.displayPic,
    d: common_vendor.t($props.info.name),
    e: common_vendor.t($options.selectedSkuText),
    f: common_vendor.t($options.displayPrice),
    g: common_vendor.f($props.info.skus, (sku, index, i0) => {
      return common_vendor.e({
        a: sku.image || $props.info.pic || $props.info.images && $props.info.images.length
      }, sku.image || $props.info.pic || $props.info.images && $props.info.images.length ? {
        b: sku.image || $props.info.pic || $props.info.images[0]
      } : {}, {
        c: common_vendor.t($options.formatSkuName(sku, index)),
        d: common_vendor.t(sku.price || $props.info.price || 0),
        e: sku.stock !== void 0
      }, sku.stock !== void 0 ? {
        f: common_vendor.t(sku.stock)
      } : {}, {
        g: sku.sku_id || index,
        h: index === $data.selectedSkuIndex ? 1 : "",
        i: common_vendor.o(($event) => $options.selectSku(index), sku.sku_id || index)
      });
    }),
    h: !$props.info.skus || $props.info.skus.length === 0
  }, !$props.info.skus || $props.info.skus.length === 0 ? {} : {}, {
    i: common_assets._imports_1$13,
    j: common_vendor.o(($event) => $options.changeQty(-1)),
    k: common_vendor.t($data.quantity),
    l: common_assets._imports_2$7,
    m: common_vendor.o(($event) => $options.changeQty(1)),
    n: $data.btnType === "cart"
  }, $data.btnType === "cart" ? {
    o: common_vendor.o((...args) => $options.onAddCart && $options.onAddCart(...args))
  } : {}, {
    p: $data.btnType === "buy"
  }, $data.btnType === "buy" ? {
    q: common_vendor.o((...args) => $options.onBuy && $options.onBuy(...args))
  } : {}, {
    r: $data.statusBarBottom + 20 + "px",
    s: common_vendor.sr("CatPopup", "dcd9a93c-0"),
    t: common_vendor.gei(_ctx, ""),
    v: common_vendor.p({
      mode: "bottom",
      id: common_vendor.gei(_ctx, "")
    })
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/pages/GoodsDetail/components/AttrPopup/AttrPopup.js.map
