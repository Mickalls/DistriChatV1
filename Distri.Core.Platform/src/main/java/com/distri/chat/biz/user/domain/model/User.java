package com.distri.chat.biz.user.domain.model;

import com.baomidou.mybatisplus.annotation.*;
import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@TableName("users")
public class User {

    @TableId(type = IdType.AUTO)
    private Long id;

    @TableField(value = "phone")
    private String phone;

    @TableField(value = "password")
    private String password;

    @TableField(value = "nickname")
    private String nickname;

    @TableField(value = "avatar")
    private String avatar;

    @TableField(value = "status")
    private String status; // ACTIVE, INACTIVE, BANNED, ...

    @TableField(value = "extra")
    private String extra; // JSON字符串

    @TableField(value = "create_time", fill = FieldFill.INSERT)
    private LocalDateTime createTime;

    @TableField(value = "update_time", fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;

    @TableLogic
    @TableField(value = "deleted")
    private Integer deleted; // 0 means not deleted

    public User(String phone, String password) {
        this.phone = phone;
        this.password = password;
        this.status = "ACTIVE";
        this.createTime = LocalDateTime.now();
        this.updateTime = LocalDateTime.now();
        this.deleted = 0;
    }
}
