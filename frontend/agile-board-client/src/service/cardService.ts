import axiosClient from '../api/axiosClient';
import type { CardRequest, CardResponse } from '../types/card';

export const cardService = {
  getCardsByList: (listId: number): Promise<CardResponse[]> => {
    return axiosClient.get<CardResponse[]>(`/cards/list/${listId}`);
  },

  createCard: (listId: number, payload: CardRequest): Promise<CardResponse> => {
    return axiosClient.post<CardResponse>(`/cards/list/${listId}`, payload);
  },

  updateCard: (id: number, payload: CardRequest): Promise<CardResponse> => {
    return axiosClient.put<CardResponse>(`/cards/${id}`, payload);
  },

  deleteCard: (id: number): Promise<void> => {
    return axiosClient.delete<void>(`/cards/${id}`);
  },
};