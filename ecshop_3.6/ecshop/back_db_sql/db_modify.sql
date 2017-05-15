ALTER TABLE `ecs_goods`
ADD COLUMN `goods_norms`  varchar(100) NOT NULL DEFAULT '' COMMENT '商品规格' AFTER `is_check`;

ALTER TABLE `ecs_goods`
ADD COLUMN `exprie_type`  varchar(100) NOT NULL DEFAULT '' COMMENT '抛弃类型' AFTER `goods_norms`;

ALTER TABLE `ecs_goods`
ADD COLUMN `water_value`  varchar(30) NOT NULL DEFAULT '' COMMENT '含水量' AFTER `exprie_type`;

