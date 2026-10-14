export interface CardResponse {
  id: number;
  title: string;
  description: string;
  position: number;
  createdAt: string;
  listId: number;
}

export interface CardRequest {
  title: string;
  description: string;
  position?: number;
  listId?: number;
}