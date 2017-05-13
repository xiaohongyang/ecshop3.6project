ALTER TABLE `ecs_goods`
ADD COLUMN `goods_norms`  varchar(100) NOT NULL DEFAULT '' COMMENT '商品规格' AFTER `is_check`;

