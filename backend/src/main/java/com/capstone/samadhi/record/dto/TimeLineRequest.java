package com.capstone.samadhi.record.dto;

import com.capstone.samadhi.common.service.S3Service;
import com.capstone.samadhi.record.entity.TimeLine;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.RequiredArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

public record TimeLineRequest(

        @NotNull(message = "유튜브 시작 시간은 필수입니다.")
        @PositiveOrZero(message = "유튜브 시작 시간은 0 이상이어야 합니다.")
        int youtube_start_sec,

        @NotNull(message = "유튜브 종료 시간은 필수입니다.")
        @PositiveOrZero(message = "유튜브 종료 시간은 0 이상이어야 합니다.") // 또는 @Positive
        int youtube_end_sec,

        @NotBlank(message = "자세 이름은 필수입니다.")
        String pose,

        @NotNull(message = "점수는 필수입니다.")
        @PositiveOrZero(message = "점수는 0 이상이어야 합니다.")
        int score,

        MultipartFile image
) {

}
