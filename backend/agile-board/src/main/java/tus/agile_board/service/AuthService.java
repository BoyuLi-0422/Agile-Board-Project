package tus.agile_board.service;

import tus.agile_board.dto.AuthRequest;
import tus.agile_board.dto.AuthResponse;

public interface AuthService {
    AuthResponse register(AuthRequest request);

    AuthResponse login(AuthRequest request);
}