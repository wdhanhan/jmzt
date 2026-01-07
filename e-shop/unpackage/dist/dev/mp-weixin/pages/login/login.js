"use strict";
const common_vendor = require("../../common/vendor.js");
const API_BASE = "https://wdxwhdglzx.jzzw-tech.cn";
class WxPhoneNumberData extends UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          phoneNumber: { type: String, optional: false },
          purePhoneNumber: { type: String, optional: true },
          countryCode: { type: String, optional: true }
        };
      },
      name: "WxPhoneNumberData"
    };
  }
  constructor(options, metadata = WxPhoneNumberData.get$UTSMetadata$(), isJSONParse = false) {
    super();
    this.__props__ = UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.phoneNumber = this.__props__.phoneNumber;
    this.purePhoneNumber = this.__props__.purePhoneNumber;
    this.countryCode = this.__props__.countryCode;
    delete this.__props__;
  }
}
class PhoneApiResponse extends UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          code: { type: Number, optional: false },
          msg: { type: String, optional: true },
          data: { type: WxPhoneNumberData, optional: true }
        };
      },
      name: "PhoneApiResponse"
    };
  }
  constructor(options, metadata = PhoneApiResponse.get$UTSMetadata$(), isJSONParse = false) {
    super();
    this.__props__ = UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.code = this.__props__.code;
    this.msg = this.__props__.msg;
    this.data = this.__props__.data;
    delete this.__props__;
  }
}
class GetPhoneNumberResult extends UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          code: { type: String, optional: true },
          errMsg: { type: String, optional: true }
        };
      },
      name: "GetPhoneNumberResult"
    };
  }
  constructor(options, metadata = GetPhoneNumberResult.get$UTSMetadata$(), isJSONParse = false) {
    super();
    this.__props__ = UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.code = this.__props__.code;
    this.errMsg = this.__props__.errMsg;
    delete this.__props__;
  }
}
class GetPhoneNumberEvent extends UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          detail: { type: GetPhoneNumberResult, optional: false }
        };
      },
      name: "GetPhoneNumberEvent"
    };
  }
  constructor(options, metadata = GetPhoneNumberEvent.get$UTSMetadata$(), isJSONParse = false) {
    super();
    this.__props__ = UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.detail = this.__props__.detail;
    delete this.__props__;
  }
}
const _sfc_main = common_vendor.defineComponent({
  data() {
    return {
      phone: "",
      hasPhone: false,
      loading: false
    };
  },
  computed: {
    displayPhone() {
      if (!this.phone || this.phone.length < 7) {
        return this.phone;
      }
      const p = this.phone;
      return p.substring(0, 3) + "****" + p.substring(7);
    }
  },
  onLoad() {
    const cachePhone = common_vendor.index.getStorageSync("mobile");
    if (cachePhone != null && cachePhone !== "") {
      this.phone = cachePhone;
      this.hasPhone = true;
    }
  },
  methods: {
    onGetPhoneNumber(e) {
      if (this.loading)
        return null;
      const detail = e.detail;
      const code = detail.code;
      const errMsg = detail.errMsg;
      if (!code || errMsg != null && !errMsg.endsWith(":ok")) {
        common_vendor.index.showToast({
          title: "您取消了手机号授权",
          icon: "none"
        });
        return null;
      }
      const openid = common_vendor.index.getStorageSync("openid");
      if (openid == null || openid === "") {
        common_vendor.index.showToast({
          title: "缺少 openid，请先完成登录",
          icon: "none"
        });
        return null;
      }
      this.loading = true;
      common_vendor.index.request({
        url: `${API_BASE}/api/wx/phone`,
        method: "POST",
        header: new UTSJSONObject({
          "content-type": "application/json"
        }),
        data: new UTSJSONObject({
          code,
          openid
          // ⭐ openid 必传
        }),
        success: (resp) => {
          var _a;
          const body = resp.data;
          if (body.code === 200 && body.data != null && body.data.phoneNumber) {
            const mobile = body.data.phoneNumber;
            this.phone = mobile;
            this.hasPhone = true;
            common_vendor.index.setStorageSync("mobile", mobile);
            common_vendor.index.showToast({
              title: "手机号获取成功",
              icon: "success"
            });
          } else {
            const msg = (_a = body.msg) !== null && _a !== void 0 ? _a : "获取手机号失败";
            common_vendor.index.showToast({
              title: msg,
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
          this.loading = false;
        }
      });
    }
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  "raw js";
  return common_vendor.e({
    a: $data.hasPhone
  }, $data.hasPhone ? {
    b: common_vendor.t($options.displayPhone)
  } : {}, {
    c: common_vendor.t($data.hasPhone ? "重新获取手机号" : "一键获取手机号"),
    d: common_vendor.o((...args) => $options.onGetPhoneNumber && $options.onGetPhoneNumber(...args)),
    e: $data.loading,
    f: $data.loading,
    g: common_vendor.sei(common_vendor.gei(_ctx, ""), "scroll-view")
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/login/login.js.map
