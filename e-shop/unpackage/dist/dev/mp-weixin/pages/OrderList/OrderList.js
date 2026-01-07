"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
class SkuSnapshot extends UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          product_id: { type: Number, optional: false },
          sku_id: { type: Number, optional: false },
          name: { type: String, optional: false },
          sku_name: { type: String, optional: false },
          price: { type: String, optional: false },
          quantity: { type: Number, optional: false },
          image: { type: String, optional: true },
          attr1: { type: String, optional: true },
          attr2: { type: String, optional: true },
          attr3: { type: String, optional: true },
          attr4: { type: String, optional: true }
        };
      },
      name: "SkuSnapshot"
    };
  }
  constructor(options, metadata = SkuSnapshot.get$UTSMetadata$(), isJSONParse = false) {
    super();
    this.__props__ = UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.product_id = this.__props__.product_id;
    this.sku_id = this.__props__.sku_id;
    this.name = this.__props__.name;
    this.sku_name = this.__props__.sku_name;
    this.price = this.__props__.price;
    this.quantity = this.__props__.quantity;
    this.image = this.__props__.image;
    this.attr1 = this.__props__.attr1;
    this.attr2 = this.__props__.attr2;
    this.attr3 = this.__props__.attr3;
    this.attr4 = this.__props__.attr4;
    delete this.__props__;
  }
}
class OrderItem extends UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          id: { type: Number, optional: false },
          order_no: { type: String, optional: false },
          user_id: { type: String, optional: false },
          user_name: { type: String, optional: false },
          id_card_no: { type: String, optional: false },
          student_school: { type: String, optional: true },
          student_grade: { type: String, optional: true },
          mobile: { type: String, optional: true },
          total_amount: { type: String, optional: false },
          pay_amount: { type: String, optional: false },
          status: { type: Number, optional: false },
          refund_status: { type: Number, optional: false },
          refund_amount: { type: String, optional: false },
          refund_time: { type: String, optional: true },
          audit_status: { type: Number, optional: false },
          receiver_name: { type: String, optional: true },
          receiver_mobile: { type: String, optional: true },
          receiver_address: { type: String, optional: true },
          items_snapshot: { type: String, optional: true },
          created_at: { type: String, optional: false },
          pay_time: { type: String, optional: true },
          items: { type: UTS.UTSType.withGenerics(Array, [SkuSnapshot]), optional: true }
        };
      },
      name: "OrderItem"
    };
  }
  constructor(options, metadata = OrderItem.get$UTSMetadata$(), isJSONParse = false) {
    super();
    this.__props__ = UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.id = this.__props__.id;
    this.order_no = this.__props__.order_no;
    this.user_id = this.__props__.user_id;
    this.user_name = this.__props__.user_name;
    this.id_card_no = this.__props__.id_card_no;
    this.student_school = this.__props__.student_school;
    this.student_grade = this.__props__.student_grade;
    this.mobile = this.__props__.mobile;
    this.total_amount = this.__props__.total_amount;
    this.pay_amount = this.__props__.pay_amount;
    this.status = this.__props__.status;
    this.refund_status = this.__props__.refund_status;
    this.refund_amount = this.__props__.refund_amount;
    this.refund_time = this.__props__.refund_time;
    this.audit_status = this.__props__.audit_status;
    this.receiver_name = this.__props__.receiver_name;
    this.receiver_mobile = this.__props__.receiver_mobile;
    this.receiver_address = this.__props__.receiver_address;
    this.items_snapshot = this.__props__.items_snapshot;
    this.created_at = this.__props__.created_at;
    this.pay_time = this.__props__.pay_time;
    this.items = this.__props__.items;
    delete this.__props__;
  }
}
const _sfc_main = common_vendor.defineComponent({
  data() {
    return {
      statusBarHeight: 0,
      tabIndex: 4,
      keyword: "",
      loading: false,
      allOrders: [],
      tabList: [
        new UTSJSONObject({ status: 0, title: "待付款" }),
        new UTSJSONObject({ status: 1, title: "已支付" }),
        new UTSJSONObject({ status: 2, title: "退款中" }),
        new UTSJSONObject({ status: 3, title: "已退款" }),
        new UTSJSONObject({ status: -1, title: "全部" })
      ]
    };
  },
  computed: {
    // 根据 tab + 关键字 过滤后的订单列表
    filteredOrders() {
      let list = this.allOrders;
      const currentTab = this.tabList[this.tabIndex];
      if (currentTab && currentTab.status !== -1) {
        const s = currentTab.status;
        list = list.filter((o) => {
          return o.status === s;
        });
      }
      const k = this.keyword.trim();
      if (k.length > 0) {
        list = list.filter((o) => {
          return o.order_no && o.order_no.indexOf(k) !== -1 || o.user_name && o.user_name.indexOf(k) !== -1 || o.mobile && o.mobile.indexOf(k) !== -1;
        });
      }
      return list;
    }
  },
  onLoad() {
    const win = common_vendor.index.getWindowInfo();
    this.statusBarHeight = win.statusBarHeight;
    this.fetchOrders();
  },
  methods: {
    onBack() {
      common_vendor.index.navigateBack();
    },
    onSearch() {
    },
    changeTab(index) {
      if (this.tabIndex === index)
        return null;
      this.tabIndex = index;
    },
    // 获取当前用户所有订单，并解析 items_snapshot
    fetchOrders() {
      const openid = common_vendor.index.getStorageSync("openid");
      if (!openid) {
        common_vendor.index.showToast({
          title: "未获取到用户身份，请先登录",
          icon: "none"
        });
        return null;
      }
      this.loading = true;
      common_vendor.index.request({
        url: "https://wdxwhdglzx.jzzw-tech.cn/api/order/list",
        method: "GET",
        data: new UTSJSONObject({ openid }),
        success: (res) => {
          const body = res.data;
          if (body && body.code === 200 && Array.isArray(body.data)) {
            const list = body.data;
            this.allOrders = list.map((it = null) => {
              let items = [];
              if (it.items_snapshot) {
                try {
                  const tmp = UTS.JSON.parse(it.items_snapshot);
                  if (Array.isArray(tmp)) {
                    items = tmp;
                  }
                } catch (e) {
                  common_vendor.index.__f__("log", "at pages/OrderList/OrderList.uvue:300", "解析 items_snapshot 失败", e, it.items_snapshot);
                }
              }
              it.items = items;
              return it;
            });
          } else {
            this.allOrders = [];
            common_vendor.index.showToast({
              title: "订单加载失败",
              icon: "none"
            });
          }
        },
        fail: (err) => {
          common_vendor.index.__f__("log", "at pages/OrderList/OrderList.uvue:315", "订单请求失败", err);
          this.allOrders = [];
          common_vendor.index.showToast({
            title: "网络错误",
            icon: "none"
          });
        },
        complete: () => {
          this.loading = false;
        }
      });
    },
    // 金额格式化：保留两位小数
    formatAmount(v = null) {
      const n = Number(v || 0);
      return n.toFixed(2);
    },
    // 状态文案
    formatStatus(s) {
      switch (s) {
        case 0:
          return "待付款";
        case 1:
          return "已支付";
        case 2:
          return "退款中";
        case 3:
          return "已退款";
        default:
          return "未知";
      }
    },
    // 时间格式化：展示时 +8 小时
    formatTime(t = null) {
      if (!t)
        return "-";
      const d = new Date(t);
      d.setHours(d.getHours());
      const year = d.getFullYear();
      const month = (d.getMonth() + 1).toString().padStart(2, "0");
      const day = d.getDate().toString().padStart(2, "0");
      const hour = d.getHours().toString().padStart(2, "0");
      const minute = d.getMinutes().toString().padStart(2, "0");
      const second = d.getSeconds().toString().padStart(2, "0");
      return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    },
    // 跳转订单详情
    goDetail(id) {
      common_vendor.index.navigateTo({
        url: `/pages/OrderDetails/OrderDetails?orderId=${id}`
      });
    }
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  "raw js";
  return common_vendor.e({
    a: common_assets._imports_0$3,
    b: common_vendor.o((...args) => $options.onBack && $options.onBack(...args)),
    c: common_assets._imports_1$3,
    d: common_vendor.o((...args) => $options.onSearch && $options.onSearch(...args)),
    e: $data.keyword,
    f: common_vendor.o(($event) => $data.keyword = $event.detail.value),
    g: common_vendor.o((...args) => $options.onSearch && $options.onSearch(...args)),
    h: $data.statusBarHeight + "px",
    i: common_vendor.f($data.tabList, (tab, index, i0) => {
      return {
        a: common_vendor.t(tab.title),
        b: common_vendor.n({
          "tab-text-active": $data.tabIndex === index
        }),
        c: common_vendor.n({
          "tab-line-active": $data.tabIndex === index
        }),
        d: index,
        e: common_vendor.o(($event) => $options.changeTab(index), index)
      };
    }),
    j: $data.loading
  }, $data.loading ? {} : $options.filteredOrders.length === 0 ? {
    l: common_assets._imports_2$5
  } : {
    m: common_vendor.f($options.filteredOrders, (order, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(order.order_no),
        b: common_vendor.t($options.formatStatus(order.status)),
        c: common_vendor.n("status-" + order.status),
        d: order.items && order.items.length > 0
      }, order.items && order.items.length > 0 ? common_vendor.e({
        e: order.items[0].image
      }, order.items[0].image ? {
        f: order.items[0].image
      } : {}, {
        g: common_vendor.t(order.items[0].name || "商品"),
        h: order.items[0].sku_name
      }, order.items[0].sku_name ? {
        i: common_vendor.t(order.items[0].sku_name)
      } : {}, {
        j: order.items[0].attr1
      }, order.items[0].attr1 ? {
        k: common_vendor.t(order.items[0].attr1)
      } : {}, {
        l: order.items[0].attr2
      }, order.items[0].attr2 ? {
        m: common_vendor.t(order.items[0].attr2)
      } : {}, {
        n: order.items[0].attr3
      }, order.items[0].attr3 ? {
        o: common_vendor.t(order.items[0].attr3)
      } : {}, {
        p: common_vendor.t(order.items[0].quantity || 1),
        q: order.items.length > 1
      }, order.items.length > 1 ? {
        r: common_vendor.t(order.items.length)
      } : {}) : {
        s: common_vendor.t(order.user_name || "—"),
        t: common_vendor.t(order.mobile || "—")
      }, {
        v: common_vendor.t($options.formatAmount(order.pay_amount)),
        w: common_vendor.t($options.formatTime(order.created_at)),
        x: order.id || index,
        y: common_vendor.o(($event) => $options.goDetail(order.id), order.id || index)
      });
    })
  }, {
    k: $options.filteredOrders.length === 0,
    n: common_vendor.sei(common_vendor.gei(_ctx, ""), "scroll-view")
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/OrderList/OrderList.js.map
