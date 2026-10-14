package tus.agile_board.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import tus.agile_board.dto.BoardListRequest;
import tus.agile_board.dto.BoardListResponse;
import tus.agile_board.model.Board;
import tus.agile_board.model.BoardList;
import tus.agile_board.repository.BoardListRepository;
import tus.agile_board.repository.BoardRepository;
import tus.agile_board.service.BoardListService;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BoardListServiceImpl implements BoardListService {

    private final BoardListRepository boardListRepository;
    private final BoardRepository boardRepository;

    @Override
    public List<BoardListResponse> getListsByBoard(Long boardId) {
        return boardListRepository.findByBoardIdOrderByPositionAsc(boardId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public BoardListResponse createList(Long boardId, BoardListRequest request) {
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new RuntimeException("Board not found"));

        BoardList list = new BoardList();
        list.setTitle(request.getTitle());
        list.setPosition(request.getPosition() != null ? request.getPosition() : 0);
        list.setBoard(board);

        return toResponse(boardListRepository.save(list));
    }

    @Override
    public BoardListResponse updateList(Long listId, BoardListRequest request) {
        BoardList list = boardListRepository.findById(listId)
                .orElseThrow(() -> new RuntimeException("List not found"));
        list.setTitle(request.getTitle());
        if (request.getPosition() != null) {
            list.setPosition(request.getPosition());
        }
        return toResponse(boardListRepository.save(list));
    }

    @Override
    public void deleteList(Long listId) {
        boardListRepository.deleteById(listId);
    }

    private BoardListResponse toResponse(BoardList list) {
        return BoardListResponse.builder()
                .id(list.getId())
                .title(list.getTitle())
                .position(list.getPosition())
                .boardId(list.getBoard().getId())
                .build();
    }
}