package com.shopping.dao;

import com.shopping.models.User;

public interface UserDAO {
    boolean registerUser(User user);
    User findByEmail(String email);
    boolean emailExists(String email);
}
