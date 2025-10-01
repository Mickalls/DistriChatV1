package com.distri.chat.biz.user.api.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserAuthResponse {
    private Long userId;
    private String accessToken;
    private String clientId;
    private String nickname;
    private String avatar;
}
