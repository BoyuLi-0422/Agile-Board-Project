package tus.agile_board.dto;

import lombok.Data;

@Data
public class BoardRequest {
    private String title;
    private String description;
}