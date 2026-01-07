"use strict";
class bannerItem extends UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          id: { type: Number, optional: false },
          pic: { type: String, optional: false },
          title: { type: String, optional: true }
        };
      },
      name: "bannerItem"
    };
  }
  constructor(options, metadata = bannerItem.get$UTSMetadata$(), isJSONParse = false) {
    super();
    this.__props__ = UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.id = this.__props__.id;
    this.pic = this.__props__.pic;
    this.title = this.__props__.title;
    delete this.__props__;
  }
}
const BannerData = [
  new bannerItem({
    id: 1,
    pic: "https://m.360buyimg.com/babel/s1071x321_jfs/t20270109/235883/3/12114/47052/659e3034F21c8d0b7/7b7abb4f8cc2627c.jpg!q70.dpg",
    title: ""
  }),
  new bannerItem({
    id: 2,
    pic: "https://m.360buyimg.com/babel/jfs/t1/232236/36/11109/182790/6597bae7Ff23261c1/11f54ec6423324ae.png",
    title: ""
  }),
  new bannerItem({
    id: 3,
    pic: "https://m.360buyimg.com/babel/jfs/t20270102/245832/19/1737/93109/6594dd77F6bf121b2/8c8bbd22ed90d51f.png",
    title: ""
  })
];
exports.BannerData = BannerData;
//# sourceMappingURL=../../.sourcemap/mp-weixin/mock/bannerData.js.map
