package com.capstone.samadhi.record.entity;

import com.capstone.samadhi.common.TimeStamp;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name="timeline")
public class TimeLine extends TimeStamp {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="timelineId")
    private Long id;

    private int youtube_start_sec;
    private int youtube_end_sec;
    private String pose;
    private float score;
    private String image;

    @ManyToOne
    @JoinColumn(name="recordId")
    private Record record;

    public void addRecord(Record record) {
        record.getTimeLineList().add(this);
        this.record = record;
    }
}
