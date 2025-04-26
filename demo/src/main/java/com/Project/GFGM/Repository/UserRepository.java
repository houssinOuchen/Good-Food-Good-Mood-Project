package com.Project.GFGM.Repository;

import com.Project.GFGM.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByUsername(String username); // for login
}
