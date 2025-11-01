package com.capstone.samadhi.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.DefaultCredentialsProvider;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3AsyncClient;


@Configuration
public class S3Config {
    @Value("${spring.cloud.aws.credentials.access-key}")
    private String accessKey;

    @Value("${spring.cloud.aws.credentials.secret-key}")
    private String accessSecret;

    @Value("${spring.cloud.aws.credentials.region.static}")
    private String regionStr;

    @Bean
    public S3AsyncClient amazonS3() {
        AwsBasicCredentials awsCredentials = AwsBasicCredentials.create(accessKey, accessSecret);
        final Region region = Region.of(regionStr);

        return S3AsyncClient.builder()
                .credentialsProvider(DefaultCredentialsProvider.create())
                .credentialsProvider(StaticCredentialsProvider.create(awsCredentials))
                .region(region)
                .build();
    }

}
