package com.ncedu.fooddelivery.api.v1.services;

import com.ncedu.fooddelivery.api.v1.dto.user.EmailChangeDTO;
import com.ncedu.fooddelivery.api.v1.dto.user.UserInfoDTO;
import com.ncedu.fooddelivery.api.v1.entities.User;

import java.util.List;

public interface UserService {

    public User getUserById(Long id);
    public UserInfoDTO getUserDTOById(Long id);

    public boolean deleteUserById(Long id);

    public boolean changeFullName(Long authedUserId, String newFullName);
    boolean changeEmail(Long id, EmailChangeDTO newEmailInfo);
    boolean changeEmail(User user, EmailChangeDTO newEmailInfo);

    public List<UserInfoDTO> getAllAdmins();
    public List<UserInfoDTO> getAllUsers();


}
