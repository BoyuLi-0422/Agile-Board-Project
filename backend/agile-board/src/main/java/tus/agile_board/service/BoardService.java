package tus.agile_board.service;

import tus.agile_board.dto.BoardRequest;
import tus.agile_board.dto.BoardResponse;
import java.util.List;

public interface BoardService {
    List<BoardResponse> getAllBoardsForUser(String username);

    BoardResponse createBoard(String username, BoardRequest request);

    BoardResponse updateBoard(Long boardId, BoardRequest request);

    void deleteBoard(Long boardId);
}