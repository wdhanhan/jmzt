CREATE TABLE coupons (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '券ID',
  name            VARCHAR(64)  NOT NULL COMMENT '券名称，例如：满30减5',
  description     VARCHAR(255) NOT NULL DEFAULT '' COMMENT '展示文案',
  threshold_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00 COMMENT '满多少金额(X)',
  discount_amount  DECIMAL(10,2) NOT NULL DEFAULT 0.00 COMMENT '减多少金额(Y)',
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
                   ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='平台优惠券定义表（满减）';



CREATE TABLE user_coupons (
  id           BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '用户券ID',
  openid       VARCHAR(64) NOT NULL COMMENT '用户openid，对应 xcx_users.openid / orders.user_id',
  coupon_id    INT UNSIGNED NOT NULL COMMENT '关联 coupons.id',
  active_time  DATETIME NOT NULL COMMENT '启用时间（用户侧真正可以开始使用的时间）',
  expire_time  DATETIME NOT NULL COMMENT '过期时间',
  status       TINYINT NOT NULL DEFAULT 0 COMMENT '0=未使用,1=已使用,2=已作废',
  used_time    DATETIME NULL COMMENT '实际使用时间',
  order_no     VARCHAR(64) DEFAULT NULL COMMENT '使用该券的订单号（orders.order_no）',
  source       VARCHAR(32)  DEFAULT NULL COMMENT '来源：register/activity/manual 等',
  remark       VARCHAR(255) DEFAULT '' COMMENT '备注',

  created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
                ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_user_status (openid, status),
  INDEX idx_coupon      (coupon_id),
  INDEX idx_expire      (expire_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户优惠券表';


-- =========================
-- 根据 VIP 规则初始化券数据
-- 对应 becomevip.uvue 中的权益：
-- 轻月卡 / 重月卡：含 6 张 3 元券
-- 分次年卡 / 自由年卡：含 12 张 5 元券
-- 下面只定义券模板，发券逻辑在服务端按需写入 user_coupons
-- =========================

INSERT INTO coupons (name, description, threshold_amount, discount_amount)
VALUES
  -- 月卡权益券：3 元优惠券，推荐满 20 元可用
  ('VIP月卡 3元券', 'VIP月卡/重月卡权益：单笔订单满20元立减3元', 20.00, 3.00),

  -- 年卡权益券：5 元优惠券，推荐满 30 元可用
  ('VIP年卡 5元券', '分次年卡/自由年卡权益：单笔订单满30元立减5元', 30.00, 5.00);
