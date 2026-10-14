package tus.agile_board.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tus.agile_board.model.Card;
import java.util.List;

public interface CardRepository extends JpaRepository<Card, Long> {
    List<Card> findByListIdOrderByPositionAsc(Long listId);
}