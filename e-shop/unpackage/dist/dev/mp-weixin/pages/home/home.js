"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "home",
  setup(__props) {
    const bgImages = common_vendor.ref([
      "/static/images/home-pic-1.avif",
      "/static/images/home-pic-2.avif"
      // 假设你第二张图叫 pic-2，如果只有一张就只留一个
    ]);
    const onJump = (url) => {
      common_vendor.index.__f__("log", "at pages/home/home.uvue:160", `[Router] 启动跳转协议，目标路径: ${url}`);
      common_vendor.index.navigateTo({
        url,
        fail: (err) => {
          if (err.errMsg.includes("tabbar")) {
            common_vendor.index.__f__("log", "at pages/home/home.uvue:167", "[Router] 命中根路由，执行 switchTab");
            common_vendor.index.switchTab({ url });
          } else {
            common_vendor.index.showToast({
              title: "链路异常: " + url,
              icon: "none"
            });
            common_vendor.index.__f__("error", "at pages/home/home.uvue:175", "[Router] 跳转彻底失败:", err);
          }
        }
      });
    };
    return (_ctx, _cache) => {
      "raw js";
      const __returned__ = {
        a: common_vendor.f(common_vendor.unref(bgImages), (img, index, i0) => {
          return {
            a: img,
            b: index
          };
        }),
        b: common_vendor.o(($event) => {
          return onJump("/pages/card/detail");
        }),
        c: common_vendor.o(($event) => {
          return onJump("/pages/activity/newuser");
        }),
        d: common_vendor.o(($event) => {
          return onJump("/pages/user/profile");
        }),
        e: common_vendor.o(($event) => {
          return onJump("/pages/classify/classify");
        }),
        f: common_vendor.o(($event) => {
          return onJump("/pages/welfare/index");
        }),
        g: common_vendor.o(($event) => {
          return onJump("/pages/card/month");
        }),
        h: common_vendor.o(($event) => {
          return onJump("/pages/member/rights");
        }),
        i: common_vendor.o(($event) => {
          return onJump("/pages/gift/card");
        }),
        j: common_vendor.o(($event) => {
          return onJump("/pages/vip/vip");
        }),
        k: common_vendor.o(($event) => {
          return onJump("/pages/member/welfare");
        }),
        l: common_vendor.o(($event) => {
          return onJump("/pages/news/food");
        }),
        m: common_vendor.o(($event) => {
          return onJump("/pages/brandnews/brandnews");
        }),
        n: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
      };
      return __returned__;
    };
  }
});
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/home/home.js.map
