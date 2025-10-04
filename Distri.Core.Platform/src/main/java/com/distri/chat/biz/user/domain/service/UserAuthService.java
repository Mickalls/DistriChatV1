package com.distri.chat.biz.user.domain.service;

import com.distri.chat.biz.user.domain.model.User;
import com.distri.chat.biz.user.infra.repo.UserMapper;
import com.distri.chat.common.exception.BusinessException;
import com.distri.chat.common.utils.JwtUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

/**
 * 用户领域服务
 * 负责用户注册、登录、认证等核心业务逻辑
 */
@Service
@Slf4j
public class UserAuthService {

    private final UserMapper userMapper;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public UserAuthService(UserMapper userMapper, JwtUtil jwtUtil) {
        this.userMapper = userMapper;
        this.passwordEncoder = new BCryptPasswordEncoder();
        this.jwtUtil = jwtUtil;
    }

    public User register(String phone, String password) {
        User user = userMapper.findByPhone(phone);
        if (user != null) {
            throw BusinessException.badRequest("手机号已被注册");
        }

        String encodedPassword = passwordEncoder.encode(password);

        User newUser = new User(phone, encodedPassword);
        newUser.setNickname(phone);

        userMapper.insert(newUser);
        return newUser;
    }

    public User login(String phone, String password) {
        User user = userMapper.findByPhone(phone);
        if (user == null) {
            throw BusinessException.badRequest("手机号未注册");
        }

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw BusinessException.badRequest("密码错误");
        }

        log.info("用户登录成功：手机号={}, 用户ID={}", phone, user.getId());
        return user;
    }

    public String generateClientId() {
        return "client_" + UUID.randomUUID().toString().replace("-", "");
    }

    /**
     * 生成JWT访问令牌
     *
     * @param userId   用户ID
     * @param clientId 设备ID
     * @return JWT token字符串
     */
    public String generateAccessToken(Long userId, String clientId) {
        return jwtUtil.generateToken(userId, clientId);
    }
}
