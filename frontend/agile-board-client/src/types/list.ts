export interface BoardListResponse {
  id: number;
  title: string;
  position: number;
  boardId: number;
}

export interface BoardListRequest {
  title: string;
  position?: number;
}