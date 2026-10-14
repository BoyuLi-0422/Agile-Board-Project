export interface BoardResponse {
  id: number;
  title: string;
  description: string;
  createdAt: string;
}

export interface BoardRequest {
  title: string;
  description: string;
}