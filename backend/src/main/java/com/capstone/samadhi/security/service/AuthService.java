package com.capstone.samadhi.security.service;


import com.capstone.samadhi.common.ResponseDto;
import com.capstone.samadhi.common.SecurityUtil;
import com.capstone.samadhi.common.service.S3Service;
import com.capstone.samadhi.exception.InternalServerException;
import com.capstone.samadhi.exception.LoginTokenException;
import com.capstone.samadhi.security.dto.SignUpDto;
import com.capstone.samadhi.security.dto.UpdateDto;
import com.capstone.samadhi.security.dto.UserInfoDto;
import com.capstone.samadhi.security.entity.User;
import com.capstone.samadhi.security.repo.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {
    private final UserRepository userRepository;
    private final S3Service s3Service;
    private final PasswordEncoder passwordEncoder;

    public ResponseEntity<?> register(SignUpDto dto) {
        if(userRepository.existsById(dto.getId())) {
            return new ResponseEntity<>(new ResponseDto<String>(false, "이미 존재하는 아이디입니다"), HttpStatus.BAD_REQUEST);
        }
        String url = "https://samadhi-bucket.s3.ap-northeast-2.amazonaws.com/default-profile.png";
        //프로필 등록
        if(dto.getProfile() != null && !dto.getProfile().isEmpty()) {
            try {
                url = s3Service.uploadFile(dto.getProfile());
            } catch (Exception e) {
                return new ResponseEntity<>(new ResponseDto<String>(false, "파일 업로드 중 에러"), HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }

        float heightToFloat = 0;
        float weightToFloat = 0;

        try {
            if(dto.getHeight() != null && !dto.getHeight().isEmpty()) {
                heightToFloat = Float.parseFloat(dto.getHeight());
            }
            if(dto.getWeight() != null && !dto.getWeight().isEmpty()) {
                weightToFloat = Float.parseFloat(dto.getWeight());
            }
        } catch (NumberFormatException ex) {
            throw new NumberFormatException("height, width값은 숫자 형식이여야 합니다");
        }

        userRepository.save(new User(
                dto.getId(),
                passwordEncoder.encode(dto.getPwd()),
                url,
                dto.getNickname(),
                dto.getGender() == null ? null : dto.getGender().name(),
                dto.getBirth(),
                heightToFloat,
                weightToFloat,
                new ArrayList<>()
        ));

        return new ResponseEntity<>(new ResponseDto<String>(true, "성공"), HttpStatus.OK);
    }

    /**
     * 회원 정보 수정
     * @param dto 수정할 데이터
     * @return 수정 결과
     */
    @Transactional
    public ResponseEntity<?> updateInfo(UpdateDto dto) {
        String userId = SecurityUtil.getCurrentUser();
        if(userId == null) {
            throw new LoginTokenException("유효한 토큰이 존재하지 않습니다");
        }
        User user = userRepository.findById(userId).orElse(null);
        if(user == null) {
            throw new LoginTokenException("존재하지 않는 사용자입니다");
        }

        if(dto.getPwd() != null) user.setPassword(passwordEncoder.encode(dto.getPwd()));
        if(dto.getNickname() != null) user.setNickname(dto.getNickname());
        if(dto.getGender() != null) user.setGender(dto.getGender().name());
        if(dto.getBirth() != null) user.setBirth(dto.getBirth());
        try {
            if(dto.getWeight() != null && !dto.getWeight().isEmpty()) user.setWeight(Float.parseFloat(dto.getWeight()));
            if(dto.getHeight() != null && !dto.getHeight().isEmpty() ) user.setHeight(Float.parseFloat(dto.getHeight()));
        } catch (NumberFormatException e) {
            log.error("타입 에러: {}", e.getMessage());
            throw new NumberFormatException("타입이 맞지 않습니다");
        }
        if(dto.getProfile() != null && !dto.getProfile().isEmpty()) {
            try {
                String url = s3Service.uploadFile(dto.getProfile());
                user.setProfile(url);
            } catch (Exception e) {
                log.error("파일 업로드 중 에러: {}", e.getMessage());
                throw new InternalServerException("프로필 사진 업로드 중 에러가 발생했습니다");
            }
        }

        return new ResponseEntity<>(new ResponseDto<>(), HttpStatus.OK);
    }

    public ResponseEntity<?> getUserInfoByUserId(String userId) {
        User user = userRepository.findById(userId).orElse(null);
        if(user == null) {
            return new ResponseEntity<>(new ResponseDto<String>(false, "존재하지 않는 사용자입니다"), HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(new ResponseDto<UserInfoDto>(true, new UserInfoDto(user)), HttpStatus.OK);
    }
}
