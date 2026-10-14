package tus.agile_board.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tus.agile_board.model.BoardList;
import java.util.List;

public interface BoardListRepository extends JpaRepository<BoardList, Long> {
    List<BoardList> findByBoardIdOrderByPositionAsc(Long boardId);
}