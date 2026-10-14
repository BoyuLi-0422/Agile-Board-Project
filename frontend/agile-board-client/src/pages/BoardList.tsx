import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { boardService } from '../service/boardService';
import type { BoardResponse } from '../types/board';

export default function BoardList() {
  const [boards, setBoards] = useState<BoardResponse[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let ignore = false;

    const loadBoards = async () => {
      try {
        const data = await boardService.getAllBoards();
        if (!ignore) setBoards(data);
      } catch (err: unknown) {
        if (!ignore) setError(err instanceof Error ? err.message : 'Failed to fetch boards');
      }
    };

    loadBoards();

    return () => {
      ignore = true; 
    };
  }, []);

  const refreshBoards = async () => {
    try {
      const data = await boardService.getAllBoards();
      setBoards(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to refresh boards');
    }
  };

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setLoading(true);
    setError('');
    try {
      await boardService.createBoard({ title: newTitle, description: '' });
      setNewTitle('');
      await refreshBoards();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create board');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">My Boards</h1>
            <p className="text-gray-500 text-sm mt-1">Manage your agile projects</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-red-600 hover:text-red-700 font-medium text-sm border border-red-200 rounded-lg px-4 py-2 hover:bg-red-50 transition"
          >
            Logout
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 rounded mb-6 text-sm">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleCreate} className="flex gap-3 mb-8">
          <input
            type="text"
            placeholder="New board title..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {loading ? 'Creating...' : '+ Create Board'}
          </button>
        </form>

        {boards.length === 0 ? (
          <div className="text-center text-gray-500 py-16 bg-white rounded-xl shadow-sm">
            <p className="text-lg">No boards yet</p>
            <p className="text-sm mt-2">Create your first board to get started!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {boards.map((board) => (
              <div
                key={board.id}
                onClick={() => navigate(`/boards/${board.id}`)}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md cursor-pointer transition transform hover:-translate-y-1"
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  {board.title}
                </h2>
                <p className="text-gray-500 text-sm">
                  {board.description || 'No description'}
                </p>
                <div className="mt-4 text-xs text-gray-400">
                  Created: {new Date(board.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}