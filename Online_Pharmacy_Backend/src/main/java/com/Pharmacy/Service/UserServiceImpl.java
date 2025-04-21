package com.Pharmacy.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.Pharmacy.Config.JwtProvider;
import com.Pharmacy.Repository.UserRepository;
import com.Pharmacy.model.User;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtProvider jwtProvider;

    @Override
    public User findUserByJwtToken(String jwt) throws Exception {
        String email = jwtProvider.getEmailFromJwtToken(jwt);
        return findUserByEmail(email);
    }

    @Override
    public User findUserByEmail(String email) throws Exception {
        System.out.println("Searching for user with email: " + email);

        User user = userRepository.findByEmail(email);
        if (user == null) {
            System.err.println("User not found for email: " + email);
            throw new Exception("User not found");
        }

        System.out.println("User found: " + user);
        return user;
    }
}


