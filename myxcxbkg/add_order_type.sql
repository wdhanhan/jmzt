-- 添加订单类型字段
ALTER TABLE `orders` 
ADD COLUMN `order_type` tinyint NOT NULL DEFAULT 0 COMMENT '订单类型 0=普通订单 1=充值订单' AFTER `status`;
