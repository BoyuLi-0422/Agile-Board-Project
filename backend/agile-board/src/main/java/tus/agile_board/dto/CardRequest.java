package tus.agile_board.dto;

import lombok.Data;

@Data
public class CardRequest {
    private String title;
    private String description;
    private Integer position;
    private Long listId; // 必须有
}