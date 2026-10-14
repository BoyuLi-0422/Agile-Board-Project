import axiosClient from '../api/axiosClient';
import type { BoardListRequest, BoardListResponse } from '../types/list';

export const listService = {

  getListsByBoard: (boardId: number): Promise<BoardListResponse[]> => {
    return axiosClient.get<BoardListResponse[]>(`/lists/board/${boardId}`);
  },

  createList: (boardId: number, payload: BoardListRequest): Promise<BoardListResponse> => {
    return axiosClient.post<BoardListResponse>(`/lists/board/${boardId}`, payload);
  },

  updateList: (id: number, payload: BoardListRequest): Promise<BoardListResponse> => {
    return axiosClient.put<BoardListResponse>(`/lists/${id}`, payload);
  },

  deleteList: (id: number): Promise<void> => {
    return axiosClient.delete<void>(`/lists/${id}`);
  },
};