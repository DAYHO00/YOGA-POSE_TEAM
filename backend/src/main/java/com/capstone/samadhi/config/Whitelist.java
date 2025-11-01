package com.capstone.samadhi.config;


import java.util.List;

public class Whitelist {


    public static final List<String> CORS_ALLOW_URL = List.of(
            "http://localhost:3001"
    );

    //모든 사람 접근 가능
    public static final List<String> PUBLIC_ENDPOINTS = List.of(
            "/**"
    );

    //사용자만 접근 가능
    public static final List<String> USER_ENDPOINTS = List.of(
    );

    //로그아웃 성공 시 홈페이지
    public static final String HOME_PAGE = "/";

    public static final List<String> SWAGGER_WHITELIST = List.of(
            "/swagger-ui.html",
            "/swagger-ui/**",
            "/v3/api-docs/**",
            "/v3/api-docs.yaml",
            "/swagger-resources/**",
            "/webjars/**",
            "/configuration/ui",
            "/configuration/security",
            "/error",
            "/favicon.ico"
    );
}
