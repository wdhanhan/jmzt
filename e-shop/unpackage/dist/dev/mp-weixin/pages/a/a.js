"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "a",
  setup(__props) {
    const prizes = ["5积分", "10元礼品卡", "5积分", "20积分", "5积分", "谢谢参与"];
    const rotateDegree = common_vendor.ref(0);
    const transitionConfig = common_vendor.ref("");
    const isSpinning = common_vendor.ref(false);
    const remainingChances = common_vendor.ref(3);
    const showModal = common_vendor.ref(false);
    const showModalAnimate = common_vendor.ref(false);
    const prizeName = common_vendor.ref("");
    const startLottery = () => {
      if (isSpinning.value)
        return null;
      if (remainingChances.value <= 0) {
        common_vendor.index.showToast({ title: "没有机会啦", icon: "none" });
        return null;
      }
      isSpinning.value = true;
      remainingChances.value--;
      const prizeIndex = Math.floor(Math.random() * 6);
      prizeName.value = prizes[prizeIndex];
      const baseRounds = 360 * 6;
      const targetAngle = prizeIndex * 60;
      const newDegree = rotateDegree.value + baseRounds + (360 - rotateDegree.value % 360) + (360 - targetAngle);
      transitionConfig.value = "transform 4s cubic-bezier(0.25, 0.1, 0.25, 1)";
      setTimeout(() => {
        rotateDegree.value = newDegree;
      }, 20);
      setTimeout(() => {
        isSpinning.value = false;
        openModal();
      }, 4e3);
    };
    const openModal = () => {
      showModal.value = true;
      setTimeout(() => {
        showModalAnimate.value = true;
      }, 50);
    };
    const closeModal = () => {
      showModalAnimate.value = false;
      setTimeout(() => {
        showModal.value = false;
      }, 200);
    };
    return (_ctx, _cache) => {
      "raw js";
      const __returned__ = common_vendor.e({
        a: common_vendor.t(common_vendor.unref(remainingChances)),
        b: "rotate(" + common_vendor.unref(rotateDegree) + "deg)",
        c: common_vendor.unref(transitionConfig),
        d: common_vendor.o(startLottery),
        e: common_vendor.unref(showModal)
      }, common_vendor.unref(showModal) ? {
        f: common_vendor.t(common_vendor.unref(prizeName)),
        g: common_vendor.o(closeModal),
        h: common_vendor.o(closeModal),
        i: common_vendor.unref(showModalAnimate) ? 1 : ""
      } : {}, {
        j: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
      });
      return __returned__;
    };
  }
});
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/a/a.js.map
