"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const API_BASE = "https://wdxwhdglzx.jzzw-tech.cn";
const _sfc_main = common_vendor.defineComponent({
  data() {
    return {
      statusBarHeight: 0,
      orderId: 0,
      order: new UTSJSONObject({}),
      items: []
      // items_snapshot 解析后的课程数组
    };
  },
  computed: {
    // 订单状态文案
    statusText() {
      const s = Number(this.order.status || 0);
      switch (s) {
        case 0:
          return "待支付";
        case 1:
          return "已支付";
        case 2:
          return "退款中";
        case 3:
          return "已退款";
        default:
          return "未知状态";
      }
    }
  },
  onLoad(options) {
    const win = common_vendor.index.getWindowInfo();
    this.statusBarHeight = win.statusBarHeight || 0;
    const idStr = options && (options.orderId || options.id) || "";
    this.orderId = Number(idStr) || 0;
    this.loadOrder();
  },
  methods: {
    // 返回上一页
    onBack() {
      common_vendor.index.navigateBack();
    },
    // 加载订单：通过 openid 拉取列表，再按 id 找到当前订单
    loadOrder() {
      const openid = common_vendor.index.getStorageSync("openid");
      if (!openid) {
        common_vendor.index.showToast({
          title: "未找到用户信息，请先登录",
          icon: "none"
        });
        return null;
      }
      common_vendor.index.request({
        url: `${API_BASE}/api/order/list`,
        method: "GET",
        data: new UTSJSONObject({ openid }),
        success: (res) => {
          const body = res.data || {};
          if (body.code !== 200) {
            common_vendor.index.showToast({
              title: body.msg || "订单加载失败",
              icon: "none"
            });
            return null;
          }
          const list = body.data || [];
          const found = list.find((o = null) => {
            return Number(o.id) === this.orderId;
          });
          if (!found) {
            common_vendor.index.showToast({
              title: "未找到该订单",
              icon: "none"
            });
            return null;
          }
          this.order = found;
          this.parseItems(found.items_snapshot);
        },
        fail: () => {
          common_vendor.index.showToast({
            title: "网络异常，请稍后重试",
            icon: "none"
          });
        }
      });
    },
    // 解析 items_snapshot 里的课程信息
    parseItems(snapshot = null) {
      this.items = [];
      if (!snapshot)
        return null;
      try {
        const arr = UTS.JSON.parse(snapshot);
        if (!Array.isArray(arr))
          return null;
        this.items = arr.map((it = null) => {
          return new UTSJSONObject({
            product_id: it.product_id,
            sku_id: it.sku_id,
            name: it.name || it.product_name || "课程",
            sku_name: it.sku_name || "",
            price: Number(it.price || 0),
            quantity: Number(it.quantity || 1),
            image: it.image || "",
            attr1: it.attr1 || "",
            attr2: it.attr2 || "",
            attr3: it.attr3 || ""
          });
        });
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/OrderDetails/OrderDetails.uvue:282", "解析 items_snapshot 出错：", e);
      }
    },
    // 金额格式化：保留两位小数
    formatAmount(v = null) {
      const n = Number(v || 0);
      return n.toFixed(2);
    },
    // 时间 +8 小时后展示
    formatTimePlus8(t = null) {
      if (!t)
        return "—";
      const d = new Date(t);
      if (isNaN(d.getTime()))
        return String(t);
      const ts = d.getTime() + 8 * 60 * 60 * 1e3;
      const dd = new Date(ts);
      const y = dd.getFullYear();
      const m = (dd.getMonth() + 1).toString().padStart(2, "0");
      const day = dd.getDate().toString().padStart(2, "0");
      const hh = dd.getHours().toString().padStart(2, "0");
      const mm = dd.getMinutes().toString().padStart(2, "0");
      const ss = dd.getSeconds().toString().padStart(2, "0");
      return `${y}-${m}-${day} ${hh}:${mm}:${ss}`;
    }
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  "raw js";
  return common_vendor.e({
    a: common_assets._imports_0$3,
    b: common_vendor.o((...args) => $options.onBack && $options.onBack(...args)),
    c: !$data.order || !$data.order.id
  }, !$data.order || !$data.order.id ? {} : common_vendor.e({
    d: common_vendor.t($options.statusText),
    e: common_vendor.n("status-" + Number($data.order.status || 0)),
    f: common_vendor.t($options.formatAmount($data.order.pay_amount)),
    g: common_vendor.t($options.formatTimePlus8($data.order.created_at)),
    h: common_vendor.t($options.formatTimePlus8($data.order.pay_time)),
    i: common_vendor.t($data.order.user_name || "—"),
    j: common_vendor.t($data.order.id_card_no || "—"),
    k: common_vendor.t($data.order.mobile || "—"),
    l: common_vendor.t($data.order.student_school || "—"),
    m: common_vendor.t($data.order.student_grade || "—"),
    n: $data.items && $data.items.length
  }, $data.items && $data.items.length ? {
    o: common_vendor.f($data.items, (it, idx, i0) => {
      return common_vendor.e({
        a: it.image
      }, it.image ? {
        b: it.image
      } : {}, {
        c: common_vendor.t(it.name),
        d: it.sku_name
      }, it.sku_name ? {
        e: common_vendor.t(it.sku_name)
      } : {}, {
        f: it.attr1 || it.attr2 || it.attr3
      }, it.attr1 || it.attr2 || it.attr3 ? common_vendor.e({
        g: it.attr1
      }, it.attr1 ? {
        h: common_vendor.t(it.attr1)
      } : {}, {
        i: it.attr2
      }, it.attr2 ? {
        j: common_vendor.t(it.attr2)
      } : {}, {
        k: it.attr3
      }, it.attr3 ? {
        l: common_vendor.t(it.attr3)
      } : {}) : {}, {
        m: common_vendor.t($options.formatAmount(it.price)),
        n: common_vendor.t(it.quantity || 1),
        o: idx
      });
    })
  } : {}, {
    p: common_vendor.t($data.order.order_no || $data.order.id),
    q: common_vendor.t($options.formatTimePlus8($data.order.created_at)),
    r: common_vendor.t($options.formatTimePlus8($data.order.pay_time)),
    s: common_vendor.t($options.statusText)
  }), {
    t: common_vendor.sei(common_vendor.gei(_ctx, ""), "scroll-view"),
    v: $data.statusBarHeight + "px"
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/OrderDetails/OrderDetails.js.map
