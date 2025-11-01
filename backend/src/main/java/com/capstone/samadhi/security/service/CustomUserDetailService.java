package com.capstone.samadhi.security.service;

import com.capstone.samadhi.security.entity.User;
import com.capstone.samadhi.security.repo.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.HashSet;

@Service
@RequiredArgsConstructor
public class CustomUserDetailService implements UserDetailsService {
    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String userId) throws UsernameNotFoundException {
        User user = userRepository.findById(userId).orElseThrow(()->new UsernameNotFoundException("Username not found"));

        SimpleGrantedAuthority userRole = new SimpleGrantedAuthority("ROME_USER");
        Collection<GrantedAuthority> roles = new HashSet<>();
        roles.add(userRole);
        return new org.springframework.security.core.userdetails.User(String.valueOf(user.getId()), user.getPassword(), roles);
    }

}
