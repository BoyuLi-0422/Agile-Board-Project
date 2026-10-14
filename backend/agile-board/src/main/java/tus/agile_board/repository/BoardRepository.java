package tus.agile_board.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tus.agile_board.model.Board;
import java.util.List;

public interface BoardRepository extends JpaRepository<Board, Long> {
    List<Board> findByUserId(Long userId);
}