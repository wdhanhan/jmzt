"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = common_vendor.defineComponent({
  data() {
    return {
      statusBarHeight: 0,
      bannerCurrent: 0,
      // ⭐ 轮播图从接口加载
      bannerList: [],
      // 首页商品列表
      goodsList: []
    };
  },
  onLoad() {
    this.statusBarHeight = common_vendor.index.getWindowInfo().statusBarHeight;
    this.loadBanners();
    this.loadGoods();
    common_vendor.index.showShareMenu(new UTSJSONObject({
      withShareTicket: true,
      menus: ["shareAppMessage", "shareTimeline"],
      success: () => {
        common_vendor.index.__f__("log", "at pages/home/home.uvue:114", "已打开分享菜单");
      },
      fail: (err = null) => {
        common_vendor.index.__f__("log", "at pages/home/home.uvue:117", "showShareMenu 失败：", err);
      }
    }));
  },
  methods: {
    // 分享给好友
    onShareAppMessage() {
      return new UTSJSONObject({
        title: "武汉东西湖青少年活动中心",
        path: "/pages/home/home"
        // 打开的路径
        // imageUrl 可选，不写就用默认截图
        // imageUrl: 'https://xxx/your-share-img.png'
      });
    },
    // 分享到朋友圈
    onShareTimeline() {
      return new UTSJSONObject({
        title: "武汉东西湖青少年活动中心"
        // 朋友圈标题
        // query 可选：'?from=timeline'
        // imageUrl: 'https://xxx/your-share-img.png'
      });
    },
    // 格式化价格
    formatPrice(price = null, type = null) {
      if (!price)
        return type ? "" : "0";
      let str = price.toString();
      let _a = common_vendor.__read(str.split("."), 2), i = _a[0], d = _a[1];
      return type === 0 ? i : d || "";
    },
    changeBanner(e = null) {
      this.bannerCurrent = e.detail.current;
    },
    onSearch() {
      common_vendor.index.navigateTo({ url: "/pages/search/search" });
    },
    // 点击 Banner -> 跳商品详情（用 product_id）
    onBannerClick(item = null) {
      if (!item.product_id)
        return null;
      common_vendor.index.navigateTo({
        url: `/pages/GoodsDetail/GoodsDetail?goodsId=${item.product_id}`
      });
    },
    onGoodsItem(item = null) {
      common_vendor.index.navigateTo({
        url: `/pages/GoodsDetail/GoodsDetail?goodsId=${item.id}`
      });
    },
    // ⭐ 加载轮播图（后端 carousel 表）
    loadBanners() {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        try {
          const res = yield common_vendor.index.request({
            url: "https://wdxwhdglzx.jzzw-tech.cn/api/carousel/list",
            method: "GET"
          });
          const body = res.data || {};
          if (body.code === 200 && Array.isArray(body.data)) {
            this.bannerList = body.data.map((b = null) => {
              return new UTSJSONObject({
                id: b.id,
                pic: b.image_url,
                product_id: b.product_id
              });
            });
          } else {
            common_vendor.index.__f__("error", "at pages/home/home.uvue:190", "加载轮播图失败:", body);
          }
        } catch (e) {
          common_vendor.index.__f__("error", "at pages/home/home.uvue:193", "加载轮播图异常:", e);
        }
      });
    },
    // ⭐ 加载首页商品
    loadGoods() {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        try {
          const res = yield common_vendor.index.request({
            url: "https://wdxwhdglzx.jzzw-tech.cn/api/products/home",
            method: "GET"
          });
          const body = res.data || {};
          const list = body.data && body.data.list || [];
          this.goodsList = list.map((g = null) => {
            return new UTSJSONObject({
              id: g.id,
              name: g.name,
              // 兼容后端字段：min_price / price
              price: g.min_price || g.price || 0,
              pic: g.pic || ""
            });
          });
        } catch (e) {
          common_vendor.index.__f__("error", "at pages/home/home.uvue:216", "加载商品失败", e);
        }
      });
    }
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  "raw js";
  return {
    a: common_vendor.o((...args) => $options.onSearch && $options.onSearch(...args)),
    b: common_assets._imports_0,
    c: $data.statusBarHeight + 50 + "px",
    d: $data.statusBarHeight + "px",
    e: common_vendor.f($data.bannerList, (item, index, i0) => {
      return {
        a: item.pic,
        b: common_vendor.o(($event) => $options.onBannerClick(item), index),
        c: index
      };
    }),
    f: common_vendor.o((...args) => $options.changeBanner && $options.changeBanner(...args)),
    g: common_vendor.f($data.bannerList, (item, index, i0) => {
      return {
        a: common_vendor.t(item),
        b: index,
        c: $data.bannerCurrent === index ? 1 : ""
      };
    }),
    h: $data.statusBarHeight + 60 + "px",
    i: common_vendor.f($data.goodsList, (item, index, i0) => {
      return common_vendor.e({
        a: item.pic,
        b: common_vendor.t(item.name),
        c: common_vendor.t($options.formatPrice(item.price, 0)),
        d: $options.formatPrice(item.price, 1)
      }, $options.formatPrice(item.price, 1) ? {
        e: common_vendor.t($options.formatPrice(item.price, 1))
      } : {}, {
        f: index,
        g: common_vendor.o(($event) => $options.onGoodsItem(item), index)
      });
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/home/home.js.map
