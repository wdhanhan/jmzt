"use strict";
const common_vendor = require("../../common/vendor.js");
const WX_APPID = "wx2ee0ec34076f93e6";
const WX_MCHID = "1738346388";
const PAY_URL = "https://jmpay.cxxyonline.cn/";
const _sfc_main = common_vendor.defineComponent({
  data() {
    return {
      statusBarHeight: 0,
      submitting: false,
      mobile: common_vendor.index.getStorageSync("mobile") || "",
      createTime: "",
      // 核心参数：全部由上个页面传入
      amount: 0,
      payDesc: "",
      payType: ""
      // 支付类型 (如：light_month)
    };
  },
  onLoad(options = null) {
    const windowInfo = common_vendor.index.getWindowInfo();
    this.statusBarHeight = windowInfo.statusBarHeight || 0;
    const now = /* @__PURE__ */ new Date();
    this.createTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
    if (options.amount)
      this.amount = parseFloat(options.amount);
    if (options.desc)
      this.payDesc = decodeURIComponent(options.desc);
    if (options.type)
      this.payType = options.type;
    if (this.amount <= 0) {
      common_vendor.index.showToast({ title: "参数错误:金额无效", icon: "none" });
      setTimeout(() => {
        return common_vendor.index.navigateBack();
      }, 1500);
    }
  },
  methods: {
    formatPrice(v) {
      const s = (v || 0).toFixed(2);
      const arr = s.split(".");
      return new UTSJSONObject({ int: arr[0], dec: arr[1] || "00" });
    },
    getTypeName(type) {
      const map = new UTSJSONObject({
        "light_month": "轻月卡开通",
        "heavy_month": "重月卡充值",
        "times_year": "分次年卡",
        "free_year": "自由年卡",
        "recharge": "余额充值"
      });
      return map[type] || "增值服务";
    },
    handlePay() {
      if (this.submitting)
        return null;
      this.submitting = true;
      const prefix = this.payType === "recharge" ? "RE" : "ME";
      const outTradeNo = prefix + Date.now();
      common_vendor.index.__f__("log", "at pages/chongzhi/chongzhi.uvue:120", "发起支付:", this.amount, this.payType);
      common_vendor.index.request({
        url: PAY_URL,
        method: "POST",
        data: new UTSJSONObject({
          appid: WX_APPID,
          mchid: WX_MCHID,
          description: this.payDesc,
          outTradeNo,
          total: Math.round(this.amount * 100),
          openid: common_vendor.index.getStorageSync("openid"),
          attach: this.payType
        }),
        success: (res = null) => {
          if (res.statusCode !== 200) {
            this.showErr("服务暂不可用");
            return null;
          }
          const p = res.data;
          common_vendor.index.requestPayment({
            timeStamp: String(p.timeStamp),
            nonceStr: p.nonceStr,
            package: p.package,
            signType: "RSA",
            paySign: p.paySign,
            success: () => {
              common_vendor.index.showToast({ title: "支付成功", icon: "success" });
              setTimeout(() => {
                if (this.payType === "recharge")
                  common_vendor.index.navigateBack();
                else
                  common_vendor.index.redirectTo({ url: "/pages/member/status" });
              }, 1500);
            },
            fail: () => {
              common_vendor.index.showToast({ title: "已取消支付", icon: "none" });
            }
          });
        },
        fail: () => {
          this.showErr("网络连接失败");
        },
        complete: () => {
          this.submitting = false;
        }
      });
    },
    showErr(msg) {
      common_vendor.index.showModal(new UTSJSONObject({ title: "提示", content: msg, showCancel: false }));
    }
  }
});
if (!Array) {
  const _component_uni_icons = common_vendor.resolveComponent("uni-icons");
  _component_uni_icons();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  "raw js";
  return common_vendor.e({
    a: $data.statusBarHeight + "px",
    b: common_vendor.p({
      type: "cart-filled",
      size: "30",
      color: "#07c160"
    }),
    c: common_vendor.t($options.formatPrice($data.amount).int),
    d: common_vendor.t($options.formatPrice($data.amount).dec),
    e: common_vendor.t($data.payDesc || "未知商品"),
    f: common_vendor.t($options.getTypeName($data.payType)),
    g: common_vendor.t($data.mobile || "当前用户"),
    h: common_vendor.t($data.createTime),
    i: !$data.submitting
  }, !$data.submitting ? {
    j: common_vendor.p({
      type: "weixin",
      size: "24",
      color: "#fff"
    })
  } : {}, {
    k: common_vendor.t($data.submitting ? "正在连接安全支付..." : "立即支付"),
    l: common_vendor.o((...args) => $options.handlePay && $options.handlePay(...args)),
    m: $data.submitting,
    n: common_vendor.p({
      type: "locked-filled",
      size: "12",
      color: "#ccc"
    }),
    o: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/chongzhi/chongzhi.js.map
