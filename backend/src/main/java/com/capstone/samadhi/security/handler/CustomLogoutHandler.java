package com.capstone.samadhi.security.handler;

import com.capstone.samadhi.exception.LoginTokenException;
import com.capstone.samadhi.security.jwt.JwtUtils;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CustomLogoutHandler implements LogoutHandler {
    private final JwtUtils jwtUtils;

    @Override
    public void logout(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {
        String token = jwtUtils.parseBearerToken(request);
        String userId = jwtUtils.validate(token);
        if(userId == null) throw new LoginTokenException("사용자 정보가 존재하지 않는 토큰입니다");
        long expirationTime = jwtUtils.getRemainTime(token);

        if(request.getSession(false) != null) {
            request.getSession().invalidate();
        }
    }
}
