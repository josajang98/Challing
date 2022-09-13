package com.ssafy.api.controller;

import com.ssafy.api.request.PhotoRequest;
import com.ssafy.api.request.UserRegisterRequest;
import com.ssafy.api.request.UserUpdateRequest;
import com.ssafy.api.response.BaseResponse;
import com.ssafy.api.response.UserResponse;
import com.ssafy.api.service.*;
import com.ssafy.db.entity.User;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {
    private final Logger logger = LoggerFactory.getLogger(this.getClass());
    private final UserService userService;
    private final InterestService interestService;
    private final UserInterestService userInterestService;
    private final FavoriteService favoriteService;
    private final PhotoService photoService;

    @PostMapping()
    @Transactional
    public ResponseEntity<?> registerUser(@RequestBody UserRegisterRequest userInfo) {
        User user = userService.registerUser(userInfo);
        user.setUserInterest(interestService.insertInterest(userInfo.getInterests(), user));
        return BaseResponse.success(UserResponse.of(user));
    }

    @GetMapping("/mypage")
    @Transactional
    public ResponseEntity<?> getUserInfo(@RequestParam String email){
        Optional<User> optionalUser = userService.getUserByEmail(email);
        User user = optionalUser.get();
        user.setUserInterest(interestService.getInterest(user));
        user.setFavorites(favoriteService.getFavoriteList(user));
        user.setPhotos(photoService.getPhotoList(user));
        return BaseResponse.success(UserResponse.of(user));
    }

    @PutMapping("/mypage")
    public ResponseEntity<?> updateUser(@RequestBody UserUpdateRequest updateInfo) {
        User user = userService.updateUser(updateInfo);
        return BaseResponse.success(UserResponse.of(user));
    }

    @GetMapping("/check")
    public ResponseEntity<?> validCheck(@RequestParam("nickname") String nickname){
        return BaseResponse.success(userService.nicknameValid(nickname));
    }

    @PostMapping("/favorite/{challenge_id}")
    public ResponseEntity<?> addFavorite(@PathVariable("challenge_id") Long challengeId, @RequestParam("email") String email){
        Optional<User> optionalUser = userService.getUserByEmail(email);
        if(optionalUser.isEmpty()){
            return BaseResponse.fail("없는 이메일 입니다.");
        }
        User user = optionalUser.get();
        favoriteService.addFavorite(challengeId, user);
        return BaseResponse.success();
    }

    @Transactional
    @DeleteMapping("/favorite/{challenge_id}")
    public ResponseEntity<?> deleteFavorite(@PathVariable("challenge_id") Long challengeId, @RequestParam("email") String email){
        Optional<User> optionalUser = userService.getUserByEmail(email);
        if(optionalUser.isEmpty()){
            return BaseResponse.fail("없는 이메일 입니다.");
        }
        User user = optionalUser.get();
        if(favoriteService.deleteFavorite(challengeId, user)){
            return BaseResponse.success();
        }

        return BaseResponse.fail("즐겨찾기 삭제 실패");
    }

    @Transactional
    @PostMapping("/photo")
    public ResponseEntity<?> addPhoto(@RequestBody PhotoRequest photoRequest){
        Optional<User> optionalUser = userService.getUserByEmail(photoRequest.getEmail());
        if(optionalUser.isEmpty()){
            return BaseResponse.fail("없는 이메일 입니다.");
        }

        User user = optionalUser.get();
        photoService.addPhoto(photoRequest.getPhotoUrl(), user);
        return BaseResponse.success();
    }

    @Transactional
    @DeleteMapping("/photo")
    public ResponseEntity<?> deletePhoto(@RequestBody PhotoRequest photoRequest){
        Optional<User> optionalUser = userService.getUserByEmail(photoRequest.getEmail());
        if(optionalUser.isEmpty()){
            return BaseResponse.fail("없는 이메일 입니다.");
        }

        User user = optionalUser.get();
        if(photoService.deletePhoto(photoRequest.getPhotoUrl(), user)){
            return BaseResponse.success();
        }

        return BaseResponse.fail("인증사진 삭제 실패");
    }




}
