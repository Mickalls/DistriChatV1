-- 用户表
CREATE TABLE IF NOT EXISTS users (
                                     id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '用户ID',
                                     phone VARCHAR(11) NOT NULL COMMENT '手机号',
    password VARCHAR(255) NOT NULL COMMENT '加密后的密码',
    nickname VARCHAR(50) NOT NULL COMMENT '用户昵称',
    avatar VARCHAR(255) DEFAULT NULL COMMENT '头像URL',
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' COMMENT '用户状态: ACTIVE, INACTIVE, BANNED',
    extra JSON DEFAULT NULL COMMENT '扩展字段，存储自定义JSON字符串',
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    deleted TINYINT(1) NOT NULL DEFAULT 0 COMMENT '逻辑删除标记: 0-未删除, 1-已删除',
    UNIQUE KEY uk_phone (phone)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

