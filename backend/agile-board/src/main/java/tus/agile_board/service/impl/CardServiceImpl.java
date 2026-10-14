package tus.agile_board.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import tus.agile_board.dto.CardRequest;
import tus.agile_board.dto.CardResponse;
import tus.agile_board.model.BoardList;
import tus.agile_board.model.Card;
import tus.agile_board.repository.BoardListRepository;
import tus.agile_board.repository.CardRepository;
import tus.agile_board.service.CardService;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CardServiceImpl implements CardService {

    private final CardRepository cardRepository;
    private final BoardListRepository boardListRepository;

    @Override
    public List<CardResponse> getCardsByList(Long listId) {
        return cardRepository.findByListIdOrderByPositionAsc(listId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public CardResponse createCard(Long listId, CardRequest request) {
        BoardList list = boardListRepository.findById(listId)
                .orElseThrow(() -> new RuntimeException("List not found"));

        Card card = new Card();
        card.setTitle(request.getTitle());
        card.setDescription(request.getDescription());
        card.setPosition(request.getPosition() != null ? request.getPosition() : 0);
        card.setList(list);

        return toResponse(cardRepository.save(card));
    }

    @Override
    public CardResponse updateCard(Long cardId, CardRequest request) {
        Card card = cardRepository.findById(cardId)
                .orElseThrow(() -> new RuntimeException("Card not found"));
        card.setTitle(request.getTitle());
        card.setDescription(request.getDescription());
        if (request.getPosition() != null) {
            card.setPosition(request.getPosition());
        }
        if (request.getListId() != null) {
            BoardList newList = boardListRepository.findById(request.getListId())
                    .orElseThrow(() -> new RuntimeException("Target list not found"));
            card.setList(newList);
        }
        return toResponse(cardRepository.save(card));
    }

    @Override
    public void deleteCard(Long cardId) {
        cardRepository.deleteById(cardId);
    }

    private CardResponse toResponse(Card card) {
        return CardResponse.builder()
                .id(card.getId())
                .title(card.getTitle())
                .description(card.getDescription())
                .position(card.getPosition())
                .createdAt(card.getCreatedAt())
                .listId(card.getList().getId())
                .build();
    }
}