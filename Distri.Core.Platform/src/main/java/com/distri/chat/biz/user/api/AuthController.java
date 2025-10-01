package com.distri.chat.biz.user.api;

import com.distri.chat.biz.user.api.request.UserLoginRequest;
import com.distri.chat.biz.user.api.response.UserLoginResponse;
import com.distri.chat.biz.user.domain.model.User;
import com.distri.chat.biz.user.domain.service.UserAuthService;
import com.distri.chat.common.dto.Result;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 认证控制器
 * 处理用户注册和登录
 */
@RestController
@RequestMapping("/api/auth")
@Tag(name = "用户认证", description = "用户注册、登录接口")
public class AuthController {

    private final UserAuthService userAuthService;

    public AuthController(UserAuthService userAuthService) {
        this.userAuthService = userAuthService;
    }

    @Operation(summary = "用户登录", description = "通过手机号和密码登录")
    @PostMapping("/login")
    public Result<UserLoginResponse> login(@Valid @RequestBody UserLoginRequest request) {
        User user = userAuthService.login(request.getPhone(), request.getPassword());
        String clientId = userAuthService.generateClientId();

        // 生成访问令牌
        String accessToken = userAuthService.generateAccessToken(user.getId(), clientId);

        // 构造响应
        UserLoginResponse response = new UserLoginResponse(
                user.getId(),
                accessToken,
                clientId,
                user.getNickname(),
                user.getAvatar()
        );

        return Result.success("登录成功", response);
    }
}
