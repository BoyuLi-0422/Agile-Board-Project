package tus.agile_board.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tus.agile_board.dto.ApiResponse;
import tus.agile_board.dto.CardRequest;
import tus.agile_board.dto.CardResponse;
import tus.agile_board.service.CardService;

import java.util.List;

@RestController
@RequestMapping("/cards")
@RequiredArgsConstructor
public class CardController {

    private final CardService cardService;

    @GetMapping("/list/{listId}")
    public ResponseEntity<ApiResponse<List<CardResponse>>> getCardsByList(@PathVariable Long listId) {
        return ResponseEntity.ok(ApiResponse.success(cardService.getCardsByList(listId)));
    }

    @PostMapping("/list/{listId}")
    public ResponseEntity<ApiResponse<CardResponse>> createCard(
            @PathVariable Long listId,
            @RequestBody CardRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Card created successfully",
                cardService.createCard(listId, request)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CardResponse>> updateCard(
            @PathVariable Long id,
            @RequestBody CardRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Card updated successfully",
                cardService.updateCard(id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCard(@PathVariable Long id) {
        cardService.deleteCard(id);
        return ResponseEntity.ok(ApiResponse.success("Card deleted successfully", null));
    }
}