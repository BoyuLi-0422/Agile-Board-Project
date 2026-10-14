package tus.agile_board.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tus.agile_board.dto.ApiResponse;
import tus.agile_board.dto.BoardListRequest;
import tus.agile_board.dto.BoardListResponse;
import tus.agile_board.service.BoardListService;

import java.util.List;

@RestController
@RequestMapping("/lists")
@RequiredArgsConstructor
public class BoardListController {

    private final BoardListService boardListService;

    @GetMapping("/board/{boardId}")
    public ResponseEntity<ApiResponse<List<BoardListResponse>>> getListsByBoard(@PathVariable Long boardId) {
        return ResponseEntity.ok(ApiResponse.success(boardListService.getListsByBoard(boardId)));
    }

    @PostMapping("/board/{boardId}")
    public ResponseEntity<ApiResponse<BoardListResponse>> createList(
            @PathVariable Long boardId,
            @RequestBody BoardListRequest request) {
        return ResponseEntity.ok(ApiResponse.success("List created successfully",
                boardListService.createList(boardId, request)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<BoardListResponse>> updateList(
            @PathVariable Long id,
            @RequestBody BoardListRequest request) {
        return ResponseEntity.ok(ApiResponse.success("List updated successfully",
                boardListService.updateList(id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteList(@PathVariable Long id) {
        boardListService.deleteList(id);
        return ResponseEntity.ok(ApiResponse.success("List deleted successfully", null));
    }
}