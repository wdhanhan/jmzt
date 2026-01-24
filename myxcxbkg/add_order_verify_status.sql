ALTER TABLE `orders`
ADD COLUMN `verify_status` TINYINT NOT NULL DEFAULT 0 COMMENT '核验状态 0=未核验 1=已核验' AFTER `order_type`;

