// 商品品牌表添加推荐标志字段
ALTER TABLE `ecs_brand`
ADD COLUMN `is_recommend`  tinyint(1) UNSIGNED NOT NULL DEFAULT 0 COMMENT '是否推荐' AFTER `is_show`;

