package tus.agile_board.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import tus.agile_board.dto.ApiResponse;
import tus.agile_board.dto.BoardRequest;
import tus.agile_board.dto.BoardResponse;
import tus.agile_board.service.BoardService;

import java.util.List;

@RestController
@RequestMapping("/boards")
@RequiredArgsConstructor
public class BoardController {

    private final BoardService boardService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<BoardResponse>>> getAllBoards(Authentication authentication) {
        List<BoardResponse> boards = boardService.getAllBoardsForUser(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(boards));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<BoardResponse>> createBoard(
            @RequestBody BoardRequest request,
            Authentication authentication) {
        BoardResponse board = boardService.createBoard(authentication.getName(), request);
        return ResponseEntity.ok(ApiResponse.success("Board created successfully", board));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<BoardResponse>> updateBoard(
            @PathVariable Long id,
            @RequestBody BoardRequest request) {
        BoardResponse board = boardService.updateBoard(id, request);
        return ResponseEntity.ok(ApiResponse.success("Board updated successfully", board));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteBoard(@PathVariable Long id) {
        boardService.deleteBoard(id);
        return ResponseEntity.ok(ApiResponse.success("Board deleted successfully", null));
    }
}