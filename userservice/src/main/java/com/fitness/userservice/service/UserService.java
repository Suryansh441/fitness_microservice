package com.fitness.userservice.service;

import org.jspecify.annotations.Nullable;
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
			User existingUser=repository.findByEmail(request.getEmail());
			UserResponse userResponse=new UserResponse();
			userResponse.setId(existingUser.getId());
			userResponse.setKeycloakId(existingUser.getKeycloakId());
			userResponse.setFirstName(existingUser.getFirstName());
			userResponse.setPassword(existingUser.getPassword());
			userResponse.setEmail(existingUser.getEmail());
			userResponse.setLastName(existingUser.getLastName());
			userResponse.setCreatedAt(existingUser.getCreatedAt());
			userResponse.setUpdatedAt(existingUser.getUpdatedAt());
			return userResponse;
		}
		User user=new User();
		user.setEmail(request.getEmail());
		user.setPassword(request.getPassword());
		user.setKeycloakId(request.getKeycloakId());
		user.setFirstName(request.getFirstName());
		user.setLastName(request.getLastName());
		
		User savedUser=repository.save(user);
		UserResponse userResponse=new UserResponse();
		userResponse.setId(savedUser.getId());
		userResponse.setKeycloakId(savedUser.getKeycloakId());
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
	public Boolean existByKeycloakId(String userId) {
		log.info("Calling USer Validation API for userId: {}",userId);
		// TODO Auto-generated method stub
		return repository.existsByKeycloakId(userId);
	}
	
}
