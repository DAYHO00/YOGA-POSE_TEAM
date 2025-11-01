package com.capstone.samadhi.common.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.async.AsyncRequestBody;
import software.amazon.awssdk.services.s3.S3AsyncClient;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.DeleteObjectResponse;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectResponse;
import software.amazon.awssdk.utils.IoUtils;

import java.io.IOException;
import java.io.InputStream;

@Service
@RequiredArgsConstructor
@Slf4j
public class S3Service {

    private final S3AsyncClient amazonS3;
    @Value("${spring.cloud.aws.s3.bucket}")
    private String bucket;

    @Value("${spring.cloud.aws.credentials.region.static}")
    private String regionStr;

    public String uploadFile(MultipartFile file) throws IOException {
        try {
            String originName = file.getOriginalFilename();
            String contentType = file.getContentType();
            InputStream targetIS = file.getInputStream();
            byte[] bytes = IoUtils.toByteArray(targetIS);
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucket)
                    .key(originName)
                    .contentDisposition(contentType)
                    .build();
            PutObjectResponse resp = amazonS3.putObject(putObjectRequest, AsyncRequestBody.fromBytes(bytes)).get();
            return getPublicUrl(originName);
        } catch (Exception e) {
            log.error("파일등록실패: {}", e.getMessage());
            return null;
        }
    }

    public boolean deleteFile(String filename) {
        try{
            DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
                    .bucket(bucket)
                    .key(filename)
                    .versionId(null)
                    .build();

            log.info("전달된 파일명: {}", filename);
            DeleteObjectResponse response = amazonS3.deleteObject(deleteObjectRequest).get();
            log.info("Responses: {}", response);
            return true;
        } catch (Exception e) {
            System.out.println(e);
            System.out.println(e.getMessage());
            log.error("에러 발생: {}", e.getMessage());
            return false;
        }

    }

    private String getPublicUrl(String filename) {
        return String.format("https://%s.s3.%s.amazonaws.com/%s", bucket, regionStr, filename);
    }
}
