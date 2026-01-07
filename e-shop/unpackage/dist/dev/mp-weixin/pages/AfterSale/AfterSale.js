"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const API_BASE = "https://wdxwhdglzx.jzzw-tech.cn";
const _sfc_main = common_vendor.defineComponent({
  data() {
    return {
      statusBarHeight: 0,
      loading: false,
      errorMsg: "",
      // 后端返回的两个核心列表
      refundableList: [],
      processingList: [],
      // 弹窗相关
      showReasonPopup: false,
      currentOrder: null,
      refundReason: ""
    };
  },
  onLoad() {
    const win = common_vendor.index.getWindowInfo();
    this.statusBarHeight = win.statusBarHeight;
    this.loadRefundOrders();
  },
  methods: {
    // 返回
    onBack() {
      common_vendor.index.navigateBack();
    },
    // 加载可申请退款 & 退款中的订单
    loadRefundOrders() {
      const openid = common_vendor.index.getStorageSync("openid");
      if (!openid) {
        this.errorMsg = "未找到 openid，请先登录后再试";
        common_vendor.index.showToast({
          title: "请先登录",
          icon: "none"
        });
        return null;
      }
      this.loading = true;
      this.errorMsg = "";
      common_vendor.index.request({
        url: `${API_BASE}/api/order/refund/list`,
        method: "GET",
        data: new UTSJSONObject({ openid }),
        success: (res) => {
          const body = res.data || {};
          if (body.code !== 200) {
            this.errorMsg = body.msg || "接口返回错误";
            return null;
          }
          const data = body.data || {};
          this.refundableList = data.refundable_orders || [];
          this.processingList = data.refund_processing_orders || [];
        },
        fail: () => {
          this.errorMsg = "网络请求失败，请稍后重试";
        },
        complete: () => {
          this.loading = false;
        }
      });
    },
    // 格式化金额
    formatAmount(v = null) {
      const n = Number(v || 0);
      return n.toFixed(2);
    },
    // +8 小时的时间格式化
    formatTimePlus8(t = null) {
      if (!t)
        return "—";
      const d = new Date(t);
      if (isNaN(d.getTime()))
        return String(t);
      const ts = d.getTime();
      const dd = new Date(ts);
      const y = dd.getFullYear();
      const m = (dd.getMonth() + 1).toString().padStart(2, "0");
      const day = dd.getDate().toString().padStart(2, "0");
      const hh = dd.getHours().toString().padStart(2, "0");
      const mm = dd.getMinutes().toString().padStart(2, "0");
      const ss = dd.getSeconds().toString().padStart(2, "0");
      return `${y}-${m}-${day} ${hh}:${mm}:${ss}`;
    },
    // 从 items_snapshot 里取出第一个课程名称
    getFirstItemName(order = null) {
      if (!order || !order.items_snapshot)
        return "课程";
      try {
        const arr = UTS.JSON.parse(order.items_snapshot);
        if (Array.isArray(arr) && arr.length > 0) {
          const it = arr[0];
          return it.product_name || it.name || "课程";
        }
      } catch (e) {
      }
      return "课程";
    },
    // 打开原因弹窗
    openReasonPopup(order = null) {
      this.currentOrder = order;
      this.refundReason = "";
      this.showReasonPopup = true;
    },
    // 关闭弹窗
    closeReasonPopup() {
      this.showReasonPopup = false;
      this.currentOrder = null;
      this.refundReason = "";
    },
    // 提交退款申请
    submitRefund() {
      if (!this.currentOrder)
        return null;
      const reason = this.refundReason.trim();
      if (!reason || reason.length < 5) {
        common_vendor.index.showToast({
          title: "请至少填写 5 个字的退款原因",
          icon: "none"
        });
        return null;
      }
      const openid = common_vendor.index.getStorageSync("openid");
      if (!openid) {
        common_vendor.index.showToast({
          title: "请先登录",
          icon: "none"
        });
        return null;
      }
      common_vendor.index.showLoading({ title: "提交中..." });
      common_vendor.index.request({
        url: `${API_BASE}/api/order/refund/apply`,
        method: "POST",
        header: new UTSJSONObject({
          "content-type": "application/json"
        }),
        data: new UTSJSONObject({
          openid,
          order_id: this.currentOrder.id,
          reason
        }),
        success: (res) => {
          const body = res.data || {};
          if (body.code === 200) {
            common_vendor.index.showToast({
              title: "申请已提交",
              icon: "success"
            });
            this.closeReasonPopup();
            this.loadRefundOrders();
          } else {
            common_vendor.index.showToast({
              title: body.msg || "申请失败",
              icon: "none"
            });
          }
        },
        fail: () => {
          common_vendor.index.showToast({
            title: "网络错误，请稍后再试",
            icon: "none"
          });
        },
        complete: () => {
          common_vendor.index.hideLoading();
        }
      });
    }
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  "raw js";
  return common_vendor.e({
    a: $data.loading || $data.errorMsg
  }, $data.loading || $data.errorMsg ? common_vendor.e({
    b: $data.loading
  }, $data.loading ? {} : {
    c: common_vendor.t($data.errorMsg)
  }) : {}, {
    d: $data.refundableList.length
  }, $data.refundableList.length ? {
    e: common_vendor.f($data.refundableList, (item, k0, i0) => {
      return {
        a: common_vendor.t($options.getFirstItemName(item)),
        b: common_vendor.t(item.order_no),
        c: common_vendor.t($options.formatAmount(item.pay_amount)),
        d: common_vendor.t(item.user_name || "—"),
        e: common_vendor.t(item.student_school || "—"),
        f: common_vendor.t(item.student_grade || "—"),
        g: common_vendor.t($options.formatTimePlus8(item.created_at)),
        h: common_vendor.t($options.formatTimePlus8(item.pay_time)),
        i: common_vendor.o(($event) => $options.openReasonPopup(item), item.id),
        j: item.id
      };
    })
  } : {}, {
    f: $data.processingList.length
  }, $data.processingList.length ? {
    g: common_vendor.f($data.processingList, (item, k0, i0) => {
      return {
        a: common_vendor.t($options.getFirstItemName(item)),
        b: common_vendor.t(item.order_no),
        c: common_vendor.t($options.formatAmount(item.pay_amount)),
        d: common_vendor.t(item.refund_reason || "用户发起退款，等待处理"),
        e: common_vendor.t($options.formatTimePlus8(item.pay_time)),
        f: item.id
      };
    })
  } : {}, {
    h: !$data.loading && !$data.errorMsg && !$data.refundableList.length && !$data.processingList.length
  }, !$data.loading && !$data.errorMsg && !$data.refundableList.length && !$data.processingList.length ? {
    i: common_assets._imports_0$10
  } : {}, {
    j: $data.showReasonPopup
  }, $data.showReasonPopup ? {
    k: common_vendor.t($data.currentOrder ? $data.currentOrder.order_no : ""),
    l: common_vendor.t($data.currentOrder ? $options.formatAmount($data.currentOrder.pay_amount) : "0.00"),
    m: common_vendor.t($data.currentOrder ? $options.getFirstItemName($data.currentOrder) : ""),
    n: $data.refundReason,
    o: common_vendor.o(($event) => $data.refundReason = $event.detail.value),
    p: common_vendor.t($data.refundReason.length),
    q: common_vendor.o((...args) => $options.closeReasonPopup && $options.closeReasonPopup(...args)),
    r: common_vendor.o((...args) => $options.submitRefund && $options.submitRefund(...args))
  } : {}, {
    s: common_vendor.sei(common_vendor.gei(_ctx, ""), "scroll-view")
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/AfterSale/AfterSale.js.map
