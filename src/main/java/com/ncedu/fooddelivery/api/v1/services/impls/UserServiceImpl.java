package com.ncedu.fooddelivery.api.v1.services.impls;

import com.ncedu.fooddelivery.api.v1.dto.user.UserInfoDTO;
import com.ncedu.fooddelivery.api.v1.entities.Role;
import com.ncedu.fooddelivery.api.v1.entities.User;
import com.ncedu.fooddelivery.api.v1.repos.UserRepo;
import com.ncedu.fooddelivery.api.v1.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    UserRepo userRepo;

    public User getUserById(Long id) {
        Optional<User> findedUser = userRepo.findById(id);
        if (findedUser.isPresent()) {
            return findedUser.get();
        }
        return null;
    }

    public UserInfoDTO getUserDTOById(Long id) {
        User user = getUserById(id);
        if (user == null) {
            return null;
        }
        return createUserDTO(user);
    }

    private UserInfoDTO createUserDTO(User user) {
       return new UserInfoDTO(user.getId(), user.getRole().name(),
                user.getFullName(), user.getEmail(),
                user.getLastSigninDate(), user.getAvatarId());
    }

    public boolean deleteUserById(Long id) {
        User userForDelete = getUserById(id);
        if (userForDelete == null) {
            return false;
        }
        userRepo.delete(userForDelete);
        return true;
    }

    @Override
    public boolean changeFullName(Long id, String newFullName) {
        User user = getUserById(id);
        boolean isModified = false;
        if (user == null) {
            return isModified;
        }
        if (newFullName != null) {
            user.setFullName(newFullName);
            userRepo.save(user);
            isModified = true;
            return isModified;
        }
        return isModified;
    }

    public List<UserInfoDTO> getAllAdmins() {
        Role adminRole = Role.ADMIN;
        List<User> admins = userRepo.findByRole(adminRole);
        List<UserInfoDTO> adminsDTO = new ArrayList<>();
        for (User admin : admins) {
            adminsDTO.add(createUserDTO(admin));
        }
        return adminsDTO;
    }

    public List<UserInfoDTO> getAllUsers() {
        Iterable<User> users = userRepo.findAll();
        Iterator<User> iterator = users.iterator();

        List<UserInfoDTO> usersDTO = new ArrayList<>();
        while (iterator.hasNext()) {
            usersDTO.add(createUserDTO(iterator.next()));
        }
        return usersDTO;
    }
}
