"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const WX_APPID = "wx506c944851f9f1eb";
const WX_MCHID = "1732393234";
const _sfc_main = common_vendor.defineComponent({
  data() {
    return {
      statusBarBottom: 0,
      // 多件商品列表，onLoad 里通过 eventChannel 赋值
      items: [],
      realName: "",
      mobile: "",
      idCardNo: "",
      studentSchool: "",
      studentGrade: "",
      submitting: false
    };
  },
  computed: {
    // 商品总价 = 所有 (price * quantity) 合计
    goodsTotal() {
      let sum = 0;
      this.items.forEach((it = null) => {
        const price = Number(it.price || 0);
        const qty = Number(it.quantity || 0);
        sum += price * qty;
      });
      return sum;
    },
    // 实付金额，暂时 = 商品总价
    payAmount() {
      return this.goodsTotal;
    }
  },
  onLoad(options) {
    const windowInfo = common_vendor.index.getWindowInfo();
    this.statusBarBottom = windowInfo.safeAreaInsets.bottom;
    const self = this;
    if (self.getOpenerEventChannel) {
      const eventChannel = self.getOpenerEventChannel();
      eventChannel.on("orderData", (data = null) => {
        common_vendor.index.__f__("log", "at pages/ConfirmOrder/ConfirmOrder.uvue:237", "ConfirmOrder 收到 orderData:", data);
        if (data && Array.isArray(data.items)) {
          this.items = data.items;
        } else {
          this.items = [];
        }
        if (this.items.length === 0) {
          common_vendor.index.showToast({
            title: "订单商品为空",
            icon: "none"
          });
        }
      });
    } else {
      common_vendor.index.__f__("warn", "at pages/ConfirmOrder/ConfirmOrder.uvue:252", "getOpenerEventChannel 不存在，可能不是通过 navigateTo 打开的");
    }
  },
  methods: {
    // 价格格式化，返回 { int, dec }
    formatPrice(v) {
      const n = Number(v || 0);
      const s = n.toFixed(2);
      const arr = s.split(".");
      return new UTSJSONObject({
        int: arr[0],
        dec: arr[1] || "00"
      });
    },
    // 提交订单 + 调起微信支付
    onSubmit() {
      if (this.submitting)
        return null;
      if (!this.realName) {
        common_vendor.index.showToast({ title: "请输入姓名", icon: "none" });
        return null;
      }
      if (!this.mobile) {
        common_vendor.index.showToast({ title: "请输入手机号", icon: "none" });
        return null;
      }
      const mobileStr = String(this.mobile).trim();
      const mobileReg = /^[0-9]{11}$/;
      if (!mobileReg.test(mobileStr)) {
        common_vendor.index.showToast({ title: "手机号需为11位数字", icon: "none" });
        return null;
      }
      if (!this.idCardNo) {
        common_vendor.index.showToast({ title: "请输入身份证号", icon: "none" });
        return null;
      }
      const idStr = String(this.idCardNo).trim();
      const idReg = /^[0-9]{17}[0-9Xx]$/;
      if (!idReg.test(idStr)) {
        common_vendor.index.showToast({ title: "身份证号需为18位数字", icon: "none" });
        return null;
      }
      if (!this.studentSchool || String(this.studentSchool).trim().length === 0) {
        common_vendor.index.showToast({ title: "请输入就读学校", icon: "none" });
        return null;
      }
      if (!this.studentGrade || String(this.studentGrade).trim().length === 0) {
        common_vendor.index.showToast({ title: "请输入就读年级", icon: "none" });
        return null;
      }
      if (!this.items.length) {
        common_vendor.index.showToast({ title: "订单商品为空", icon: "none" });
        return null;
      }
      const openid = common_vendor.index.getStorageSync("openid");
      if (!openid) {
        common_vendor.index.showToast({
          title: "缺少 openid，请重新登录",
          icon: "none"
        });
        return null;
      }
      const payload = new UTSJSONObject({
        userId: openid || 0,
        realName: this.realName,
        mobile: mobileStr,
        idCardNo: idStr,
        studentSchool: String(this.studentSchool).trim(),
        studentGrade: String(this.studentGrade).trim(),
        items: this.items
      });
      this.submitting = true;
      common_vendor.index.request({
        url: "https://wdxwhdglzx.jzzw-tech.cn/api/orders/create",
        method: "POST",
        header: new UTSJSONObject({
          "content-type": "application/json"
        }),
        data: payload,
        success: (res = null) => {
          const data = res.data;
          if (data.code === 200) {
            const orderData = data.data || new UTSJSONObject({});
            const orderNo = orderData.orderNo;
            const payAmount = Number(orderData.payAmount || this.payAmount);
            this.doWxPay(orderNo, payAmount, openid);
          } else {
            common_vendor.index.showToast({
              title: data.message || "提交失败",
              icon: "none"
            });
            this.submitting = false;
          }
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/ConfirmOrder/ConfirmOrder.uvue:368", "创建订单失败", err);
          common_vendor.index.showToast({
            title: "网络错误，稍后重试",
            icon: "none"
          });
          this.submitting = false;
        }
      });
    },
    // 微信支付（调用 https://pay.jzzw-tech.cn/）
    doWxPay(orderNo, payAmount, openid) {
      const total = Math.round(Number(payAmount || 0) * 100);
      if (!total || total <= 0) {
        common_vendor.index.showToast({
          title: "支付金额异常",
          icon: "none"
        });
        this.submitting = false;
        return null;
      }
      common_vendor.index.request({
        url: "https://pay.jzzw-tech.cn/",
        method: "POST",
        header: new UTSJSONObject({ "content-type": "application/json" }),
        data: new UTSJSONObject({
          appid: WX_APPID,
          mchid: WX_MCHID,
          description: "订单支付",
          outTradeNo: orderNo,
          attach: "shop_order",
          total,
          openid
        }),
        success: (resPay = null) => {
          common_vendor.index.__f__("log", "at pages/ConfirmOrder/ConfirmOrder.uvue:406", "统一下单返回：", resPay.data);
          const payData = resPay.data;
          const _a = payData || new UTSJSONObject({});
          _a.appId;
          const timeStamp = _a.timeStamp, nonceStr = _a.nonceStr, pkg = _a.package, signType = _a.signType, paySign = _a.paySign;
          if (!pkg || !paySign || !timeStamp || !nonceStr) {
            common_vendor.index.showToast({
              title: "支付下单返回不完整",
              icon: "none"
            });
            this.submitting = false;
            return null;
          }
          common_vendor.index.requestPayment({
            timeStamp: String(timeStamp),
            nonceStr,
            package: pkg,
            signType: signType || "RSA",
            paySign,
            success: (resPay2 = null) => {
              common_vendor.index.__f__("log", "at pages/ConfirmOrder/ConfirmOrder.uvue:437", "支付成功：", resPay2);
              common_vendor.index.showToast({ title: "支付成功", icon: "success" });
              setTimeout(() => {
                common_vendor.index.navigateTo({
                  url: "/pages/OrderList/OrderList"
                });
              }, 500);
            },
            fail: (err = null) => {
              common_vendor.index.__f__("log", "at pages/ConfirmOrder/ConfirmOrder.uvue:446", "支付失败：", err);
              common_vendor.index.showToast({
                title: "支付未完成",
                icon: "none"
              });
            },
            complete: () => {
              this.submitting = false;
            }
          });
        },
        fail: (err) => {
          common_vendor.index.__f__("log", "at pages/ConfirmOrder/ConfirmOrder.uvue:458", "统一下单请求失败：", err);
          common_vendor.index.showToast({
            title: "支付请求失败",
            icon: "none"
          });
          this.submitting = false;
        }
      });
    }
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  "raw js";
  return common_vendor.e({
    a: $data.realName,
    b: common_vendor.o(($event) => $data.realName = $event.detail.value),
    c: $data.mobile,
    d: common_vendor.o(($event) => $data.mobile = $event.detail.value),
    e: $data.idCardNo,
    f: common_vendor.o(($event) => $data.idCardNo = $event.detail.value),
    g: $data.studentSchool,
    h: common_vendor.o(($event) => $data.studentSchool = $event.detail.value),
    i: $data.studentGrade,
    j: common_vendor.o(($event) => $data.studentGrade = $event.detail.value),
    k: common_assets._imports_0$1,
    l: common_vendor.f($data.items, (item, index, i0) => {
      return {
        a: item.image || "",
        b: common_vendor.t(item.name || item.product_name || "商品"),
        c: common_vendor.t(item.sku_name || "默认规格"),
        d: common_vendor.t($options.formatPrice(item.price).int),
        e: common_vendor.t($options.formatPrice(item.price).dec),
        f: common_vendor.t(item.quantity),
        g: index
      };
    }),
    m: $data.items.length === 0
  }, $data.items.length === 0 ? {} : {}, {
    n: common_vendor.t($options.formatPrice($options.goodsTotal).int),
    o: common_vendor.t($options.formatPrice($options.goodsTotal).dec),
    p: common_vendor.t($options.formatPrice($options.payAmount).int),
    q: common_vendor.t($options.formatPrice($options.payAmount).dec),
    r: common_vendor.t($options.formatPrice($options.payAmount).int),
    s: common_vendor.t($options.formatPrice($options.payAmount).dec),
    t: common_vendor.t($data.submitting ? "提交中..." : "提交订单并支付"),
    v: common_vendor.o((...args) => $options.onSubmit && $options.onSubmit(...args)),
    w: $data.statusBarBottom + "px",
    x: common_vendor.sei(common_vendor.gei(_ctx, ""), "view"),
    y: $data.statusBarBottom + 50 + "px"
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/ConfirmOrder/ConfirmOrder.js.map
