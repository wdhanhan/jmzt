"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
if (!Math) {
  "./pages/home/home.js";
  "./pages/classify/classify.js";
  "./pages/cart/cart.js";
  "./pages/my/my.js";
  "./pages/search/search.js";
  "./pages/SearchGoods/SearchGoods.js";
  "./pages/GoodsDetail/GoodsDetail.js";
  "./pages/ConfirmOrder/ConfirmOrder.js";
  "./pages/AddressList/AddressList.js";
  "./pages/AddressAddEdit/AddressAddEdit.js";
  "./pages/GoodsCollect/GoodsCollect.js";
  "./pages/ShopCollect/ShopCollect.js";
  "./pages/OrderList/OrderList.js";
  "./pages/OrderDetails/OrderDetails.js";
  "./pages/setting/setting.js";
  "./pages/PersonalInfo/PersonalInfo.js";
  "./pages/MemberCenter/MemberCenter.js";
  "./pages/seckill/seckill.js";
  "./pages/MyCoupon/MyCoupon.js";
  "./pages/CouponUseRecord/CouponUseRecord.js";
  "./pages/CouponCenter/CouponCenter.js";
  "./pages/ShopDetails/ShopDetails.js";
  "./pages/ShopDetails/ShopGoods/ShopGoods.js";
  "./pages/ShopDetails/ShopClassify/ShopClassify.js";
  "./pages/ShopDetails/ShopGoodsResult/ShopGoodsResult.js";
  "./pages/SpecialOffer/SpecialOffer.js";
  "./pages/brand/brand.js";
  "./pages/ClassifyGoods/ClassifyGoods.js";
  "./pages/message/message.js";
  "./pages/GoodsEvaluate/GoodsEvaluate.js";
  "./pages/AfterSale/AfterSale.js";
  "./pages/login/login.js";
  "./pages/a/a.js";
  "./pages/chongzhi/chongzhi.js";
  "./pages/vip/vip.js";
  "./pages/brandnews/brandnews.js";
}
const _sfc_main = common_vendor.defineComponent({
  onLaunch() {
    common_vendor.index.__f__("log", "at App.uvue:6", "App Launch");
    this.wxLogin();
  },
  onShow() {
    common_vendor.index.__f__("log", "at App.uvue:11", "App Show");
  },
  onHide() {
    common_vendor.index.__f__("log", "at App.uvue:15", "App Hide");
  },
  // 👇 只在 APP 端才有的生命周期，用条件编译包起来
  methods: {
    wxLogin() {
      const oldOpenid = common_vendor.index.getStorageSync("openid");
      if (oldOpenid && oldOpenid.length > 0) {
        common_vendor.index.__f__("log", "at App.uvue:47", "已有 openid：", oldOpenid);
        return null;
      }
      common_vendor.index.login(new UTSJSONObject({
        provider: "weixin",
        success: (loginRes) => {
          common_vendor.index.__f__("log", "at App.uvue:54", "uni.login success:", loginRes);
          if (!loginRes.code) {
            common_vendor.index.showToast({
              title: "微信登录失败：无 code",
              icon: "none"
            });
            return null;
          }
          common_vendor.index.request({
            url: "https://jmzt.cxxyonline.cn/api/wechat/openid",
            method: "POST",
            header: new UTSJSONObject({
              "content-type": "application/json"
            }),
            data: new UTSJSONObject({
              code: loginRes.code
            }),
            success: (res) => {
              common_vendor.index.__f__("log", "at App.uvue:75", "openid 接口返回:", res);
              const body = res.data;
              if (body["code"] == 200) {
                const data = body["data"];
                const openid = data["openid"];
                common_vendor.index.__f__("log", "at App.uvue:85", "拿到 openid:", openid);
                common_vendor.index.setStorageSync("openid", openid);
                common_vendor.index.showToast({
                  title: "登录成功",
                  icon: "success"
                });
              } else {
                common_vendor.index.showToast({
                  title: "获取 openid 失败:" + body["message"],
                  icon: "none"
                });
              }
            },
            fail: (err) => {
              common_vendor.index.__f__("log", "at App.uvue:102", "请求 openid 接口失败:", err);
              common_vendor.index.showToast({
                title: "服务器错误",
                icon: "none"
              });
            }
          });
        },
        fail: (err) => {
          common_vendor.index.__f__("log", "at App.uvue:111", "uni.login fail:", err);
          common_vendor.index.showToast({
            title: "微信登录失败",
            icon: "none"
          });
        }
      }));
    }
  }
});
const page = () => {
  return "./components/page/page.js";
};
function createApp() {
  const app = common_vendor.createSSRApp(_sfc_main);
  app.component("page", page);
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
//# sourceMappingURL=../.sourcemap/mp-weixin/app.js.map
