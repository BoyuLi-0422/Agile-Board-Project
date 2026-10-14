package tus.agile_board.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class BoardResponse {
    private Long id;
    private String title;
    private String description;
    private LocalDateTime createdAt;
}