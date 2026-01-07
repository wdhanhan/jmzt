"use strict";
const common_vendor = require("./vendor.js");
function toast(title) {
  common_vendor.index.showToast({
    title,
    icon: "none",
    duration: 2e3
  });
}
exports.toast = toast;
//# sourceMappingURL=../../.sourcemap/mp-weixin/common/way.js.map
