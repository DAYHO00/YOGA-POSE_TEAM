package com.capstone.samadhi.security.jwt;

import io.jsonwebtoken.security.Keys;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;
import software.amazon.awssdk.services.s3.endpoints.internal.Value;

import javax.crypto.SecretKey;

@Component
public class SecurityConstants {
    public static String JWT_SECRET;
    public static SecretKey SECRET_KEY;

    public SecurityConstants(Environment env) {
        JWT_SECRET = env.getProperty("security.secret.key");
        SECRET_KEY = Keys.hmacShaKeyFor(JWT_SECRET.getBytes());
    }
}
