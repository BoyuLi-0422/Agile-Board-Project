import axiosClient from '../api/axiosClient';
import type { BoardRequest, BoardResponse } from '../types/board';


export const boardService = {
  getAllBoards: (): Promise<BoardResponse[]> => {
    return axiosClient.get<BoardResponse[]>('/boards');
  },

  createBoard: (payload: BoardRequest): Promise<BoardResponse> => {
    return axiosClient.post<BoardResponse>('/boards', payload);
  },

  updateBoard: (id: number, payload: BoardRequest): Promise<BoardResponse> => {
    return axiosClient.put<BoardResponse>(`/boards/${id}`, payload);
  },

  deleteBoard: (id: number): Promise<void> => {
    return axiosClient.delete<void>(`/boards/${id}`);
  },
};