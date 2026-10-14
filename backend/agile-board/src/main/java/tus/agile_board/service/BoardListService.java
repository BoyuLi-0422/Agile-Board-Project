package tus.agile_board.service;

import tus.agile_board.dto.BoardListRequest;
import tus.agile_board.dto.BoardListResponse;
import java.util.List;

public interface BoardListService {
    List<BoardListResponse> getListsByBoard(Long boardId);

    BoardListResponse createList(Long boardId, BoardListRequest request);

    BoardListResponse updateList(Long listId, BoardListRequest request);

    void deleteList(Long listId);
}