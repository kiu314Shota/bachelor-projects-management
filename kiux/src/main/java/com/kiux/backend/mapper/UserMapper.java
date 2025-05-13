//package com.kiux.backend.mapper;
//
//import com.kiux.backend.dto.UserDTO;
//import com.kiux.backend.model.User;
//
//public class UserMapper {
//
//    public static UserDTO toDTO(User user) {
//        if (user == null) return null;
//        return new UserDTO(user.getId(), user.getUsername(), user.getEmail());
//    }
//
//    public static User fromDTO(UserDTO dto) {
//        if (dto == null) return null;
//        return User.builder()
//                .id(dto.getId())
//                .username(dto.getUsername())
//                .email(dto.getEmail())
//                .build();
//    }
//}