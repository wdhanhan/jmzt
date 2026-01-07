"use strict";
class classifyItem extends UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          id: { type: Number, optional: false },
          parent: { type: Number, optional: false },
          name: { type: String, optional: false },
          pic: { type: String, optional: true },
          children: { type: "Unknown", optional: false }
        };
      },
      name: "classifyItem"
    };
  }
  constructor(options, metadata = classifyItem.get$UTSMetadata$(), isJSONParse = false) {
    super();
    this.__props__ = UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.id = this.__props__.id;
    this.parent = this.__props__.parent;
    this.name = this.__props__.name;
    this.pic = this.__props__.pic;
    this.children = this.__props__.children;
    delete this.__props__;
  }
}
const ClassifyData = [
  new classifyItem({
    id: 1,
    parent: 0,
    name: "手机",
    pic: "",
    children: [
      new classifyItem({
        id: 2,
        parent: 1,
        name: "手机通讯",
        pic: "",
        children: [
          new classifyItem({
            id: 3,
            parent: 2,
            name: "游戏手机",
            pic: "https://img11.360buyimg.com/focus/s140x140_jfs/t11470/45/2362968077/2689/fb36d9a0/5a169238Nc8f0882b.jpg",
            children: []
          }),
          new classifyItem({
            id: 4,
            parent: 2,
            name: "手机",
            pic: "https://img10.360buyimg.com/focus/s140x140_jfs/t11503/241/2246064496/4783/cea2850e/5a169216N0701c7f1.jpg",
            children: []
          }),
          new classifyItem({
            id: 5,
            parent: 2,
            name: "全面屏手机",
            pic: "https://img30.360buyimg.com/focus/s140x140_jfs/t18955/187/1309277884/11517/fe100782/5ac48d27N3f5bb821.jpg",
            children: []
          })
        ]
      }),
      new classifyItem({
        id: 24,
        parent: 1,
        name: "品牌",
        pic: "",
        children: [
          new classifyItem({
            id: 25,
            parent: 24,
            name: "华为",
            pic: "https://img14.360buyimg.com/focus/s140x140_jfs/t11929/135/2372293765/1396/e103ec31/5a1692e2Nbea6e136.jpg",
            children: []
          }),
          new classifyItem({
            id: 26,
            parent: 24,
            name: "小米",
            pic: "https://img30.360buyimg.com/focus/s140x140_jfs/t13411/188/926813276/3945/a4f47292/5a1692eeN105a64b4.png",
            children: []
          }),
          new classifyItem({
            id: 27,
            parent: 24,
            name: "荣耀",
            pic: "https://img10.360buyimg.com/focus/s140x140_jfs/t12178/348/911080073/4732/db0ad9c7/5a1692e2N6df7c609.jpg",
            children: []
          }),
          new classifyItem({
            id: 28,
            parent: 24,
            name: "苹果",
            pic: "https://img20.360buyimg.com/focus/s140x140_jfs/t13759/194/897734755/2493/1305d4c4/5a1692ebN8ae73077.jpg",
            children: []
          })
        ]
      })
    ]
  }),
  new classifyItem({
    id: 6,
    parent: 0,
    name: "电脑办公",
    pic: "",
    children: [
      new classifyItem({
        id: 7,
        parent: 6,
        name: "笔记本",
        pic: "",
        children: [
          new classifyItem({
            id: 8,
            parent: 7,
            name: "轻薄本",
            pic: "https://img13.360buyimg.com/focus/s140x140_jfs/t11071/195/2462134264/9117/cd0688bf/5a17ba79N18b9f3d4.png",
            children: []
          }),
          new classifyItem({
            id: 9,
            parent: 7,
            name: "游戏本",
            pic: "https://img30.360buyimg.com/focus/s140x140_jfs/t11155/36/2330310765/10690/eb6754c3/5a17ba96N49561fea.png",
            children: []
          }),
          new classifyItem({
            id: 10,
            parent: 7,
            name: "办公本",
            pic: "https://img20.360buyimg.com/focus/s140x140_jfs/t12499/273/957225674/6892/8281d4a7/5a17b962Nf77d9f6c.jpg",
            children: []
          })
        ]
      })
    ]
  }),
  new classifyItem({
    id: 11,
    parent: 0,
    name: "服装",
    pic: "",
    children: [
      new classifyItem({
        id: 12,
        parent: 11,
        name: "男装",
        pic: "",
        children: [
          new classifyItem({
            id: 13,
            parent: 12,
            name: "风衣",
            pic: "https://img20.360buyimg.com/focus/s140x140_jfs/t17890/31/1269777779/2792/917e13d0/5ac47830N63e76af2.jpg",
            children: []
          }),
          new classifyItem({
            id: 14,
            parent: 12,
            name: "T恤",
            pic: "https://img12.360buyimg.com/focus/s140x140_jfs/t17641/277/1305218449/8776/e5182bbe/5ac47ffaN8a7b2e14.png",
            children: []
          })
        ]
      }),
      new classifyItem({
        id: 15,
        parent: 11,
        name: "女装",
        pic: "",
        children: [
          new classifyItem({
            id: 16,
            parent: 15,
            name: "连衣裙",
            pic: "https://img30.360buyimg.com/focus/s140x140_jfs/t16891/72/715748110/3080/182127b5/5a9fb67aN37c4848f.jpg",
            children: []
          })
        ]
      })
    ]
  }),
  new classifyItem({
    id: 17,
    parent: 0,
    name: "美妆护肤",
    pic: "",
    children: [
      new classifyItem({
        id: 18,
        parent: 17,
        name: "拔草推荐",
        pic: "",
        children: [
          new classifyItem({
            id: 19,
            parent: 18,
            name: "显白口红",
            pic: "https://img10.360buyimg.com/focus/s140x140_jfs/t1/95022/3/13977/20829/5e5f2636E20222316/bbc6e2cf5b10669e.jpg",
            children: []
          }),
          new classifyItem({
            id: 20,
            parent: 18,
            name: "明星同款面膜",
            pic: "https://img14.360buyimg.com/focus/s140x140_jfs/t1/91206/20/13565/9379/5e5f262bE45790537/0373287c48fa2317.jpg",
            children: []
          })
        ]
      }),
      new classifyItem({
        id: 21,
        parent: 17,
        name: "彩妆",
        pic: "",
        children: [
          new classifyItem({
            id: 22,
            parent: 21,
            name: "美甲",
            pic: "https://img11.360buyimg.com/focus/s140x140_jfs/t18340/344/2560965947/8933/468d229f/5afd3c2aN62a8f842.jpg",
            children: []
          }),
          new classifyItem({
            id: 23,
            parent: 21,
            name: "粉底液",
            pic: "https://img20.360buyimg.com/focus/s140x140_jfs/t20692/251/127894832/28255/9c74e1cd/5afd3c1eN4eb4f341.jpg",
            children: []
          })
        ]
      })
    ]
  })
];
exports.ClassifyData = ClassifyData;
exports.classifyItem = classifyItem;
//# sourceMappingURL=../../.sourcemap/mp-weixin/mock/classifyData.js.map
