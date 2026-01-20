"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const API_BASE = "https://wdxwhdglzx.jzzw-tech.cn";
const _sfc_main = common_vendor.defineComponent({
  data() {
    return {
      cartShops: [],
      guessList: []
      // 猜你喜欢
    };
  },
  computed: {
    // 是否有任何商品
    hasGoods() {
      return this.cartShops.some((shop) => {
        return shop.goods.length > 0;
      });
    },
    // 是否全部勾选
    allChecked() {
      const allGoods = this.flatGoods();
      if (!allGoods.length)
        return false;
      return allGoods.every((g) => {
        return g.checked;
      });
    },
    // 被选中的商品列表
    selectedGoods() {
      return this.flatGoods().filter((g) => {
        return g.checked;
      });
    },
    // 选中商品总价
    selectedTotal() {
      let total = 0;
      this.selectedGoods.forEach((g) => {
        total += Number(g.price || 0) * Number(g.count || 0);
      });
      return total;
    },
    selectedTotalInt() {
      const s = this.selectedTotal.toFixed(2);
      return s.split(".")[0];
    },
    selectedTotalDec() {
      const s = this.selectedTotal.toFixed(2);
      return s.split(".")[1] || "00";
    }
  },
  onShow() {
    this.loadCart();
  },
  methods: {
    // 扁平化所有商品
    flatGoods() {
      const arr = [];
      this.cartShops.forEach((shop) => {
        shop.goods.forEach((g = null) => {
          return arr.push(g);
        });
      });
      return arr;
    },
    // =====================
    // 加载购物车数据
    // =====================
    loadCart() {
      const openid = common_vendor.index.getStorageSync("openid");
      if (!openid) {
        return null;
      }
      common_vendor.index.showLoading({ title: "加载中" });
      common_vendor.index.request({
        url: `${API_BASE}/api/cart/list`,
        method: "GET",
        data: new UTSJSONObject({ openid }),
        success: (res) => {
          const body = res.data || {};
          if (body.code !== 200) {
            common_vendor.index.showToast({ title: body.msg || "购物车加载失败", icon: "none" });
            return null;
          }
          const list = body.data || [];
          const goods = list.map((item = null) => {
            return new UTSJSONObject({
              id: item.cart_id,
              sku_id: item.sku_id,
              product_id: item.product_id,
              name: item.product_name || item.name,
              pic: item.image,
              sku_text: item.sku_name || "",
              sku_name: item.sku_name || "",
              price: item.price,
              count: item.quantity,
              attr1: item.attr1,
              attr2: item.attr2,
              attr3: item.attr3,
              attr4: item.attr4,
              checked: false
              // 默认不选中
            });
          });
          this.cartShops = [
            {
              shopName: "默认店铺",
              checked: false,
              goods
            }
          ];
        },
        complete: () => {
          common_vendor.index.hideLoading();
        }
      });
    },
    // =====================
    // 格式化金额
    // =====================
    formatPrice(price = null, type = null) {
      if (!price)
        return type ? "" : "0";
      let _a = common_vendor.__read(price.toString().split("."), 2), i = _a[0], d = _a[1];
      return type === 0 ? i : d || "";
    },
    // =====================
    // 店铺级勾选
    // =====================
    toggleShop(sIndex = null) {
      const shop = this.cartShops[sIndex];
      const next = !shop.checked;
      shop.checked = next;
      shop.goods.forEach((g = null) => {
        return g.checked = next;
      });
    },
    // =====================
    // 单个商品勾选
    // =====================
    toggleItem(sIndex = null, gIndex = null) {
      const shop = this.cartShops[sIndex];
      const g = shop.goods[gIndex];
      g.checked = !g.checked;
      shop.checked = shop.goods.length > 0 && shop.goods.every((x = null) => {
        return x.checked;
      });
    },
    // =====================
    // 全选 / 取消全选
    // =====================
    toggleAll() {
      const next = !this.allChecked;
      this.cartShops.forEach((shop) => {
        shop.checked = next;
        shop.goods.forEach((g = null) => {
          return g.checked = next;
        });
      });
    },
    // =====================
    // 更改数量（加减）
    // =====================
    changeQty(sIndex = null, gIndex = null, delta = null) {
      const shop = this.cartShops[sIndex];
      const g = shop.goods[gIndex];
      const next = g.count + delta;
      const openid = common_vendor.index.getStorageSync("openid");
      if (!openid) {
        common_vendor.index.showToast({ title: "请先登录", icon: "none" });
        return null;
      }
      if (next <= 0) {
        common_vendor.index.request({
          url: `${API_BASE}/api/cart/update`,
          method: "POST",
          header: new UTSJSONObject({ "content-type": "application/json" }),
          data: new UTSJSONObject({
            openid,
            sku_id: g.sku_id,
            quantity: 0
          }),
          success: (res) => {
            const body = res.data || {};
            if (body.code === 200) {
              shop.goods.splice(gIndex, 1);
            } else {
              common_vendor.index.showToast({
                title: body.msg || "更新失败",
                icon: "none"
              });
            }
          },
          fail: () => {
            common_vendor.index.showToast({
              title: "网络错误，请稍后重试",
              icon: "none"
            });
          }
        });
      } else {
        common_vendor.index.request({
          url: `${API_BASE}/api/cart/update`,
          method: "POST",
          header: new UTSJSONObject({ "content-type": "application/json" }),
          data: new UTSJSONObject({
            openid,
            sku_id: g.sku_id,
            quantity: next
          }),
          success: (res) => {
            const body = res.data || {};
            if (body.code === 200) {
              g.count = next;
            } else {
              common_vendor.index.showToast({
                title: body.msg || "更新失败",
                icon: "none"
              });
            }
          },
          fail: () => {
            common_vendor.index.showToast({
              title: "网络错误，请稍后重试",
              icon: "none"
            });
          }
        });
      }
    },
    // =====================
    // 去首页逛逛
    // =====================
    goHome() {
      common_vendor.index.switchTab({
        url: "/pages/classify/classify"
      });
    },
    // =====================
    // 猜你喜欢点击
    // =====================
    onGuessItem(item = null) {
      common_vendor.index.navigateTo({
        url: `/pages/GoodsDetail/GoodsDetail?goodsId=${item.id}`
      });
    },
    // =====================
    // 去结算（把选中的多件商品传给 ConfirmOrder）
    // =====================
    goSettle() {
      const selected = this.selectedGoods;
      if (!selected.length) {
        common_vendor.index.showToast({
          title: "请先选择要结算的商品",
          icon: "none"
        });
        return null;
      }
      const orderItems = selected.map((g) => {
        return new UTSJSONObject({
          product_id: g.product_id,
          sku_id: g.sku_id,
          name: g.name,
          sku_name: g.sku_name || g.sku_text || "",
          price: g.price,
          quantity: g.count,
          image: g.pic,
          attr1: g.attr1,
          attr2: g.attr2,
          attr3: g.attr3,
          attr4: g.attr4
        });
      });
      common_vendor.index.navigateTo({
        url: "/pages/ConfirmOrder/ConfirmOrder",
        success: (res) => {
          const eventChannel = res.eventChannel;
          eventChannel.emit("orderData", new UTSJSONObject({
            items: orderItems,
            from: "cart"
          }));
        }
      });
    }
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  "raw js";
  return common_vendor.e({
    a: common_vendor.f($data.cartShops, (shop, sIndex, i0) => {
      return {
        a: shop.checked ? "/static/images/icon/check_on.png" : "/static/images/icon/check_off.png",
        b: common_vendor.o(($event) => $options.toggleShop(sIndex), sIndex),
        c: common_vendor.t(shop.shopName),
        d: common_vendor.f(shop.goods, (g, gIndex, i1) => {
          return common_vendor.e({
            a: g.checked ? "/static/images/icon/check_on.png" : "/static/images/icon/check_off.png",
            b: common_vendor.o(($event) => $options.toggleItem(sIndex, gIndex), g.id || g.sku_id || gIndex),
            c: g.pic,
            d: common_vendor.t(g.name),
            e: common_vendor.t(g.sku_text || ""),
            f: common_vendor.t($options.formatPrice(g.price, 0)),
            g: $options.formatPrice(g.price, 1)
          }, $options.formatPrice(g.price, 1) ? {
            h: common_vendor.t($options.formatPrice(g.price, 1))
          } : {}, {
            i: common_vendor.o(($event) => $options.changeQty(sIndex, gIndex, -1), g.id || g.sku_id || gIndex),
            j: common_vendor.t(g.count),
            k: common_vendor.o(($event) => $options.changeQty(sIndex, gIndex, 1), g.id || g.sku_id || gIndex),
            l: g.id || g.sku_id || gIndex
          });
        }),
        e: sIndex
      };
    }),
    b: common_assets._imports_0,
    c: common_assets._imports_1,
    d: common_assets._imports_2,
    e: !$options.hasGoods
  }, !$options.hasGoods ? {
    f: common_assets._imports_3,
    g: common_vendor.o((...args) => $options.goHome && $options.goHome(...args))
  } : {}, {
    h: $options.hasGoods
  }, $options.hasGoods ? {
    i: $options.allChecked ? "/static/images/icon/check_on.png" : "/static/images/icon/check_off.png",
    j: common_vendor.o((...args) => $options.toggleAll && $options.toggleAll(...args)),
    k: common_vendor.t($options.selectedTotalInt),
    l: common_vendor.t($options.selectedTotalDec),
    m: common_vendor.o((...args) => $options.goSettle && $options.goSettle(...args))
  } : {}, {
    n: common_vendor.f($data.guessList, (item, index, i0) => {
      return common_vendor.e({
        a: item.pic,
        b: common_vendor.t(item.name),
        c: common_vendor.t($options.formatPrice(item.price, 0)),
        d: $options.formatPrice(item.price, 1)
      }, $options.formatPrice(item.price, 1) ? {
        e: common_vendor.t($options.formatPrice(item.price, 1))
      } : {}, {
        f: index,
        g: common_vendor.o(($event) => $options.onGuessItem(item), index)
      });
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/cart/cart.js.map
