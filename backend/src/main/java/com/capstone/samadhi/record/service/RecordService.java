package com.capstone.samadhi.record.service;

import com.capstone.samadhi.common.ResponseDto;
import com.capstone.samadhi.record.dto.RecordRequest;
import com.capstone.samadhi.record.dto.RecordResponse;
import com.capstone.samadhi.record.dto.TimeLineRequest;
import com.capstone.samadhi.record.entity.Record;
import com.capstone.samadhi.record.entity.TimeLine;
import com.capstone.samadhi.record.repository.RecordRepository;
import com.capstone.samadhi.security.entity.User;
import com.capstone.samadhi.security.repo.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.nio.file.AccessDeniedException;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly=true)
@RequiredArgsConstructor
public class RecordService {
    private final TimeLineService timeLineService;
    private final RecordRepository recordRepository;
    private final UserRepository userRepository;
    @Transactional
    public ResponseDto<RecordResponse> save(String userId, RecordRequest request) throws IOException {
        User user = userRepository.findById(userId).orElseThrow(EntityNotFoundException::new);
        Record record = request.toEntity(user);
        recordRepository.save(record);
        for (TimeLineRequest timeLineRequest : request.timeLineList()) {
            TimeLine timeLine = timeLineService.saveTimeLine(timeLineRequest);
            timeLine.addRecord(record);
        }
        return new ResponseDto<>(true, RecordResponse.from(record));
    }

    public ResponseDto<RecordResponse> findById(String userId, Long id) throws AccessDeniedException {
        Record record = recordRepository.findById(id).orElseThrow(()-> new EntityNotFoundException("Record not found"));
        if(!record.getUser().getId().equals(record)){
           throw new AccessDeniedException("접근 권한이 없습니다.");
        }

        RecordResponse response = RecordResponse.from(record);
        return new ResponseDto<>(true, response);
    }
    public ResponseDto<List<RecordResponse>> findByUser(String userId) {

        User user = userRepository.findById(userId).orElseThrow(EntityNotFoundException::new);

        List<Record> recordPage = recordRepository.findByUser(user);

        List<RecordResponse> responseList = recordPage.stream()
                .map(RecordResponse::from)
                .collect(Collectors.toList());

        return new ResponseDto<>(true, responseList);
    }
}
