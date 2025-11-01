package com.capstone.samadhi.security.controller;


import com.capstone.samadhi.common.ResponseDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {
    @GetMapping("/")
    public ResponseEntity<?> test() {
        return new ResponseEntity<>(new ResponseDto<String>(true, "성공"), HttpStatus.OK);
    }
}
