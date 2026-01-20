"use strict";
const common_vendor = require("../../common/vendor.js");
const API_BASE = "https://jmzt.cxxyonline.cn";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "classify",
  setup(__props) {
    const activeTab = common_vendor.ref("fresh");
    const showStoreList = common_vendor.ref(false);
    const scrollIntoViewId = common_vendor.ref("");
    const mockStores = [
      new UTSJSONObject({ id: 1, name: "北京市昌平区鼓楼西大街店", address: "鼓楼西大街14号", distance: 490 }),
      new UTSJSONObject({ id: 2, name: "回龙观西大街店", address: "回龙观西大街118号", distance: 1200 }),
      new UTSJSONObject({ id: 3, name: "天通苑华联店", address: "天通中苑2区", distance: 5400 })
    ];
    const currentStore = common_vendor.ref(mockStores[0]);
    const categories = common_vendor.ref([]);
    const products = common_vendor.ref([]);
    const loading = common_vendor.ref(true);
    const activeCategoryId = common_vendor.ref(null);
    const cart = common_vendor.ref([]);
    const cartAnim = common_vendor.ref(false);
    const showCartDrawer = common_vendor.ref(false);
    const showSkuModal = common_vendor.ref(false);
    const currentProduct = common_vendor.ref(new UTSJSONObject({}));
    const selectedSku = common_vendor.ref(null);
    common_vendor.onMounted(() => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        yield Promise.all([loadCategories(), loadProducts()]);
        loading.value = false;
      });
    });
    const loadCategories = () => {
      return new Promise((resolve) => {
        common_vendor.index.request({
          url: `${API_BASE}/api/categories/list`,
          success: (res) => {
            if (res.statusCode === 200 && res.data.code === 200) {
              categories.value = res.data.data || [];
            }
            resolve();
          },
          fail: () => {
            return resolve();
          }
        });
      });
    };
    const loadProducts = () => {
      return new Promise((resolve) => {
        common_vendor.index.request({
          url: `${API_BASE}/api/products/list`,
          success: (res) => {
            if (res.statusCode === 200 && res.data.code === 200) {
              products.value = res.data.data || [];
            }
            resolve();
          },
          fail: () => {
            return resolve();
          }
        });
      });
    };
    const groupedData = common_vendor.computed(() => {
      if (!categories.value.length || !products.value.length)
        return [];
      return categories.value.map((cat) => {
        const items = products.value.filter((p) => {
          return p.category_id === cat.id;
        });
        return Object.assign(Object.assign({}, cat), { products: items });
      }).filter((group = null) => {
        return group.products.length > 0;
      });
    });
    const scrollToCategory = (id = null) => {
      activeCategoryId.value = id;
      scrollIntoViewId.value = "cat-" + id;
    };
    const onRightScroll = (e = null) => {
      scrollIntoViewId.value = "";
    };
    const getProductImage = (p = null) => {
      if (p.images && p.images.length) {
        try {
          const imgs = typeof p.images === "string" ? UTS.JSON.parse(p.images) : p.images;
          return imgs[0];
        } catch (e) {
          return null;
        }
      }
      return null;
    };
    const getShowPrice = (p = null) => {
      if (p.skus && p.skus.length > 0)
        return parseFloat(p.skus[0].price);
      return 0;
    };
    const formatSkuName = (sku = null) => {
      const attrs = [sku.attr1, sku.attr2, sku.attr3, sku.attr4].filter((a = null) => {
        return a;
      });
      return attrs.length > 0 ? attrs.join(" | ") : sku.sku_name;
    };
    const handleAddClick = (product = null) => {
      if (product.skus && product.skus.length > 1) {
        openSkuModal(product);
      } else if (product.skus && product.skus.length === 1) {
        addToCart(product, product.skus[0]);
      } else {
        common_vendor.index.showToast({ title: "暂无规格", icon: "none" });
      }
    };
    const openSkuModal = (product = null) => {
      currentProduct.value = product;
      selectedSku.value = product.skus[0];
      showSkuModal.value = true;
    };
    const closeSkuModal = () => {
      showSkuModal.value = false;
    };
    const selectSku = (sku = null) => {
      selectedSku.value = sku;
    };
    const confirmAddSku = () => {
      if (!selectedSku.value)
        return null;
      addToCart(currentProduct.value, selectedSku.value);
      closeSkuModal();
    };
    const addToCart = (product = null, sku = null) => {
      cart.value.push({
        productId: product.id,
        name: product.name,
        skuId: sku.sku_id,
        skuName: sku.sku_name,
        price: parseFloat(sku.price)
      });
      cartAnim.value = true;
      setTimeout(() => {
        return cartAnim.value = false;
      }, 300);
      common_vendor.index.showToast({ title: "已加入", icon: "none" });
    };
    const cartTotalCount = common_vendor.computed(() => {
      return cart.value.length;
    });
    const cartTotalPrice = common_vendor.computed(() => {
      return cart.value.reduce((sum, item) => {
        return sum + item.price;
      }, 0);
    });
    const cartDisplayList = common_vendor.computed(() => {
      var e_1, _a;
      const map = /* @__PURE__ */ new Map();
      try {
        for (var _b = common_vendor.__values(cart.value), _c = _b.next(); !_c.done; _c = _b.next()) {
          var item = _c.value;
          const key = `${item.productId}__${item.skuId}`;
          const existing = UTS.mapGet(map, key);
          if (existing) {
            existing.count += 1;
          } else {
            map.set(key, new UTSJSONObject(Object.assign(Object.assign({}, item), { key, count: 1 })));
          }
        }
      } catch (e_1_1) {
        e_1 = { error: e_1_1 };
      } finally {
        try {
          if (_c && !_c.done && (_a = _b.return))
            _a.call(_b);
        } finally {
          if (e_1)
            throw e_1.error;
        }
      }
      return Array.from(map.values());
    });
    const toggleCartDrawer = () => {
      if (cartTotalCount.value <= 0) {
        common_vendor.index.showToast({ title: "未选购商品", icon: "none" });
        return null;
      }
      showCartDrawer.value = !showCartDrawer.value;
    };
    const closeCartDrawer = () => {
      showCartDrawer.value = false;
    };
    const clearCart = () => {
      cart.value = [];
      showCartDrawer.value = false;
    };
    const removeOneFromCart = (line = null) => {
      const idx = cart.value.findIndex((i) => {
        return i.productId === line.productId && i.skuId === line.skuId;
      });
      if (idx >= 0)
        cart.value.splice(idx, 1);
      if (cart.value.length === 0)
        showCartDrawer.value = false;
    };
    const addOneFromCartLine = (line = null) => {
      cart.value.push({
        productId: line.productId,
        name: line.name,
        skuId: line.skuId,
        skuName: line.skuName,
        price: parseFloat(line.price)
      });
      cartAnim.value = true;
      setTimeout(() => {
        return cartAnim.value = false;
      }, 300);
    };
    const getCategoryCount = (group = null) => {
      const pIds = group.products.map((p = null) => {
        return p.id;
      });
      return cart.value.filter((c) => {
        return pIds.includes(c.productId);
      }).length;
    };
    const openStoreList = () => {
      showStoreList.value = true;
    };
    const selectStore = (store = null) => {
      currentStore.value = store;
      showStoreList.value = false;
    };
    const openApp = (app = null) => {
      common_vendor.index.showToast({ title: `正在打开${app === "meituan" ? "美团" : "饿了么"}...`, icon: "none" });
    };
    return (_ctx, _cache) => {
      "raw js";
      const __returned__ = common_vendor.e({
        a: common_vendor.t(currentStore.value.name),
        b: common_vendor.t(currentStore.value.distance),
        c: common_vendor.o(openStoreList),
        d: activeTab.value === "fresh" ? 1 : "",
        e: activeTab.value === "fresh"
      }, activeTab.value === "fresh" ? {} : {}, {
        f: activeTab.value === "fresh" ? 1 : "",
        g: common_vendor.o(($event) => {
          return activeTab.value = "fresh";
        }),
        h: activeTab.value === "cooked" ? 1 : "",
        i: activeTab.value === "cooked"
      }, activeTab.value === "cooked" ? {} : {}, {
        j: activeTab.value === "cooked" ? 1 : "",
        k: common_vendor.o(($event) => {
          return activeTab.value = "cooked";
        }),
        l: activeTab.value === "fresh"
      }, activeTab.value === "fresh" ? common_vendor.e({
        m: common_vendor.f(groupedData.value, (group, index, i0) => {
          return common_vendor.e({
            a: common_vendor.t(group.name),
            b: activeCategoryId.value === group.id ? 1 : "",
            c: getCategoryCount(group) > 0
          }, getCategoryCount(group) > 0 ? {
            d: common_vendor.t(getCategoryCount(group))
          } : {}, {
            e: group.id,
            f: activeCategoryId.value === group.id ? 1 : "",
            g: common_vendor.o(($event) => {
              return scrollToCategory(group.id);
            }, group.id)
          });
        }),
        n: loading.value
      }, loading.value ? {} : {
        o: common_vendor.f(groupedData.value, (group, k0, i0) => {
          return {
            a: common_vendor.t(group.name),
            b: common_vendor.f(group.products, (p, k1, i1) => {
              return common_vendor.e({
                a: getProductImage(p)
              }, getProductImage(p) ? {
                b: getProductImage(p)
              } : {}, {
                c: common_vendor.t(p.name),
                d: common_vendor.t(p.description),
                e: common_vendor.t(getShowPrice(p)),
                f: common_vendor.t(p.skus && p.skus.length > 1 ? "选规格" : "+"),
                g: common_vendor.o(($event) => {
                  return handleAddClick(p);
                }, p.id),
                h: p.id
              });
            }),
            c: common_vendor.sei("cat-" + group.id, "view"),
            d: group.id
          };
        })
      }, {
        p: scrollIntoViewId.value,
        q: common_vendor.o(onRightScroll)
      }) : {
        r: common_vendor.o(($event) => {
          return openApp("meituan");
        }),
        s: common_vendor.o(($event) => {
          return openApp("eleme");
        })
      }, {
        t: activeTab.value === "fresh"
      }, activeTab.value === "fresh" ? common_vendor.e({
        v: cartTotalCount.value > 0
      }, cartTotalCount.value > 0 ? {
        w: common_vendor.t(cartTotalCount.value)
      } : {}, {
        x: cartAnim.value ? 1 : "",
        y: common_vendor.o(toggleCartDrawer),
        z: cartTotalCount.value > 0
      }, cartTotalCount.value > 0 ? {
        A: common_vendor.t(cartTotalPrice.value.toFixed(2))
      } : {}, {
        B: common_vendor.o(toggleCartDrawer),
        C: common_vendor.t(cartTotalCount.value > 0 ? "去结算" : "¥0 起送"),
        D: cartTotalCount.value > 0 ? 1 : ""
      }) : {}, {
        E: activeTab.value === "fresh" && showCartDrawer.value
      }, activeTab.value === "fresh" && showCartDrawer.value ? common_vendor.e({
        F: common_vendor.o(clearCart),
        G: cartDisplayList.value.length === 0
      }, cartDisplayList.value.length === 0 ? {} : {
        H: common_vendor.f(cartDisplayList.value, (line, k0, i0) => {
          return common_vendor.e({
            a: common_vendor.t(line.name),
            b: line.skuName
          }, line.skuName ? {
            c: common_vendor.t(line.skuName)
          } : {}, {
            d: common_vendor.t((line.price * line.count).toFixed(2)),
            e: common_vendor.o(($event) => {
              return removeOneFromCart(line);
            }, line.key),
            f: common_vendor.t(line.count),
            g: common_vendor.o(($event) => {
              return addOneFromCartLine(line);
            }, line.key),
            h: line.key
          });
        })
      }, {
        I: common_vendor.o(() => {
        }),
        J: common_vendor.o(closeCartDrawer)
      }) : {}, {
        K: showSkuModal.value
      }, showSkuModal.value ? {
        L: common_vendor.t(currentProduct.value.name),
        M: common_vendor.o(closeSkuModal),
        N: common_vendor.f(currentProduct.value.skus, (sku, k0, i0) => {
          return {
            a: common_vendor.t(formatSkuName(sku)),
            b: selectedSku.value && selectedSku.value.sku_id === sku.sku_id ? 1 : "",
            c: sku.sku_id,
            d: selectedSku.value && selectedSku.value.sku_id === sku.sku_id ? 1 : "",
            e: common_vendor.o(($event) => {
              return selectSku(sku);
            }, sku.sku_id)
          };
        }),
        O: common_vendor.t(selectedSku.value ? selectedSku.value.price : getShowPrice(currentProduct.value)),
        P: !selectedSku.value,
        Q: common_vendor.o(confirmAddSku),
        R: common_vendor.o(() => {
        }),
        S: common_vendor.o(closeSkuModal)
      } : {}, {
        T: showStoreList.value
      }, showStoreList.value ? {
        U: common_vendor.o(($event) => {
          return showStoreList.value = false;
        }),
        V: common_vendor.f(mockStores, (store, k0, i0) => {
          return {
            a: common_vendor.t(store.name),
            b: store.id === currentStore.value.id ? 1 : "",
            c: common_vendor.t(store.address),
            d: common_vendor.t(store.distance),
            e: store.id,
            f: common_vendor.o(($event) => {
              return selectStore(store);
            }, store.id)
          };
        }),
        W: common_vendor.o(() => {
        }),
        X: common_vendor.o(($event) => {
          return showStoreList.value = false;
        })
      } : {}, {
        Y: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
      });
      return __returned__;
    };
  }
});
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/classify/classify.js.map
