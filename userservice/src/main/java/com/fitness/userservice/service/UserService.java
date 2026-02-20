package com.fitness.userservice.service;

import org.springframework.stereotype.Service;

import com.fitness.userservice.dto.RegisterRequest;
import com.fitness.userservice.dto.UserResponse;
import com.fitness.userservice.model.User;
import com.fitness.userservice.repository.UserRepository;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@AllArgsConstructor
public class UserService {

	private UserRepository repository;
	public UserResponse register(RegisterRequest request) {
		
		if(repository.existsByEmail(request.getEmail()))
		{
			throw new RuntimeException("Email already exists");
		}
		User user=new User();
		user.setEmail(request.getEmail());
		user.setPassword(request.getPassword());
		user.setFirstName(request.getFirstName());
		user.setLastName(request.getLastName());
		
		User savedUser=repository.save(user);
		UserResponse userResponse=new UserResponse();
		userResponse.setId(savedUser.getId());
		userResponse.setFirstName(savedUser.getFirstName());
		userResponse.setPassword(savedUser.getPassword());
		userResponse.setEmail(savedUser.getEmail());
		userResponse.setLastName(savedUser.getLastName());
		userResponse.setCreatedAt(savedUser.getCreatedAt());
		userResponse.setUpdatedAt(savedUser.getUpdatedAt());
		
		return userResponse;
	}
	public UserResponse getUserProfile(String userId) {
		// TODO Auto-generated method stub
		User user=repository.findById(userId).orElseThrow(()-> new RuntimeException("User Not Found"));
		
		UserResponse userResponse=new UserResponse();
		userResponse.setId(user.getId());
		userResponse.setFirstName(user.getFirstName());
		userResponse.setPassword(user.getPassword());
		userResponse.setEmail(user.getEmail());
		userResponse.setLastName(user.getLastName());
		userResponse.setCreatedAt(user.getCreatedAt());
		userResponse.setUpdatedAt(user.getUpdatedAt());
		
		return userResponse;
		
	}
	public Boolean existByUserId(String userId) {
		log.info("Calling USer Validation API for userId: {}",userId);
		// TODO Auto-generated method stub
		return repository.existsById(userId);
	}

}
