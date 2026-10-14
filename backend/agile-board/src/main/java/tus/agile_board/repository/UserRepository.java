package tus.agile_board.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tus.agile_board.model.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);
}