package com.capstone.samadhi.security.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.Date;

@Data
public class SignUpDto {
    @Schema(description = "아이디")
    private String id;
    @Schema(description = "비밀번호")
    private String pwd;
    @Schema(description = "닉네임")
    private String nickname;
    @Schema(description = "성별", example = "f", allowableValues = {"f", "m"})
    private Gender gender;
    @Schema(description = "생년월일", example = "2000-01-01")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate birth;
    @Schema(description = "몸무게")
    private float weight;
    @Schema(description = "키")
    private float height;
    @Schema(description = "프로필 사진 데이터")
    private MultipartFile profile;

    public enum Gender {
        f, m
    }
}
