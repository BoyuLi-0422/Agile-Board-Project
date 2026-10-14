package tus.agile_board.dto;

import lombok.Data;

@Data
public class BoardListRequest {
    private String title;
    private Integer position;
}