package com.capstone.samadhi.record.service;

import com.capstone.samadhi.common.service.S3Service;
import com.capstone.samadhi.record.dto.TimeLineRequest;
import com.capstone.samadhi.record.entity.TimeLine;
import com.capstone.samadhi.record.repository.TimeLineRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
@RequiredArgsConstructor
public class TimeLineService {

    private final S3Service s3Service;
    private final TimeLineRepository timeLineRepository;

    public TimeLine saveTimeLine(TimeLineRequest request) throws IOException {
        String imageUrl = null;

        if (request.image() != null && !request.image().isEmpty()) {
            imageUrl = s3Service.uploadFile(request.image());
        }

        TimeLine timeLine = TimeLine.builder()
                .youtube_start_sec(request.youtube_start_sec())
                .youtube_end_sec(request.youtube_end_sec())
                .pose(request.pose())
                .score(request.score())
                .image(imageUrl)
                .build();

        return timeLineRepository.save(timeLine);
    }
}

