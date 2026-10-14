package tus.agile_board.service;

import tus.agile_board.dto.CardRequest;
import tus.agile_board.dto.CardResponse;
import java.util.List;

public interface CardService {
    List<CardResponse> getCardsByList(Long listId);

    CardResponse createCard(Long listId, CardRequest request);

    CardResponse updateCard(Long cardId, CardRequest request);

    void deleteCard(Long cardId);
}