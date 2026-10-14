package tus.agile_board.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import tus.agile_board.dto.BoardRequest;
import tus.agile_board.dto.BoardResponse;
import tus.agile_board.model.Board;
import tus.agile_board.model.User;
import tus.agile_board.repository.BoardRepository;
import tus.agile_board.repository.UserRepository;
import tus.agile_board.service.BoardService;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BoardServiceImpl implements BoardService {

    private final BoardRepository boardRepository;
    private final UserRepository userRepository;

    @Override
    public List<BoardResponse> getAllBoardsForUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return boardRepository.findByUserId(user.getId())
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public BoardResponse createBoard(String username, BoardRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Board board = new Board();
        board.setTitle(request.getTitle());
        board.setDescription(request.getDescription());
        board.setUser(user);

        return toResponse(boardRepository.save(board));
    }

    @Override
    public BoardResponse updateBoard(Long boardId, BoardRequest request) {
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new RuntimeException("Board not found"));
        board.setTitle(request.getTitle());
        board.setDescription(request.getDescription());
        return toResponse(boardRepository.save(board));
    }

    @Override
    public void deleteBoard(Long boardId) {
        boardRepository.deleteById(boardId);
    }

    private BoardResponse toResponse(Board board) {
        return BoardResponse.builder()
                .id(board.getId())
                .title(board.getTitle())
                .description(board.getDescription())
                .createdAt(board.getCreatedAt())
                .build();
    }
}