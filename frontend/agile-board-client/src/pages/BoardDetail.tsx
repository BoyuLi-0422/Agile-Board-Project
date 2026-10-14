import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';
import { listService } from '../service/listService';
import { cardService } from '../service/cardService';
import type { BoardListResponse } from '../types/list';
import type { CardResponse } from '../types/card';

export default function BoardDetail() {
  const { boardId } = useParams<{ boardId: string }>();
  const navigate = useNavigate();

  const [lists, setLists] = useState<BoardListResponse[]>([]);
  const [cards, setCards] = useState<Record<number, CardResponse[]>>({});
  const [newListTitle, setNewListTitle] = useState('');
  const [cardInputs, setCardInputs] = useState<Record<number, string>>({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const loadData = async () => {
    if (!boardId) return;
    setLoading(true);
    setError('');
    try {
      const fetchedLists = await listService.getListsByBoard(Number(boardId));
      setLists(fetchedLists);

      const cardsMap: Record<number, CardResponse[]> = {};
      await Promise.all(
        fetchedLists.map(async (list) => {
          const listCards = await cardService.getCardsByList(list.id);
          cardsMap[list.id] = listCards;
        })
      );
      setCards(cardsMap);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load board');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    let ignore = false;

    const initFetch = async () => {
      if (!boardId) return;
      setLoading(true);
      setError('');
      try {
        const fetchedLists = await listService.getListsByBoard(Number(boardId));
        const cardsMap: Record<number, CardResponse[]> = {};
        await Promise.all(
          fetchedLists.map(async (list) => {
            const listCards = await cardService.getCardsByList(list.id);
            cardsMap[list.id] = listCards;
          })
        );
        if (!ignore) {
          setLists(fetchedLists);
          setCards(cardsMap);
        }
      } catch (err: unknown) {
        if (!ignore) setError(err instanceof Error ? err.message : 'Failed to load board');
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    initFetch();

    return () => {
      ignore = true;
    };
  }, [boardId]);

  const handleAddList = async (e: FormEvent) => {
    e.preventDefault();
    if (!newListTitle.trim() || !boardId) return;

    try {
      await listService.createList(Number(boardId), {
        title: newListTitle,
        position: lists.length + 1,
      });
      setNewListTitle('');
      loadData(); 
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create list');
    }
  };

  const handleAddCard = async (listId: number, e: FormEvent) => {
    e.preventDefault();
    const title = cardInputs[listId];
    if (!title?.trim()) return;

    try {
      const currentCards = cards[listId] || [];
      await cardService.createCard(listId, {
        title,
        description: '',
        position: currentCards.length + 1,
      });
      setCardInputs({ ...cardInputs, [listId]: '' });
      loadData();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create card');
    }
  };

  const handleDeleteList = async (listId: number) => {
    if (!window.confirm('Delete this list and all its cards?')) return;
    try {
      await listService.deleteList(listId);
      loadData();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to delete list');
    }
  };

  const handleDeleteCard = async (cardId: number) => {
    if (!window.confirm('Delete this card?')) return;
    try {
      await cardService.deleteCard(cardId);
      loadData();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to delete card');
    }
  };

  const onDragEnd = async (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceListId = Number(source.droppableId);
    const destListId = Number(destination.droppableId);

    if (sourceListId === destListId) {
      const listCards = Array.from(cards[sourceListId] || []);
      const [moved] = listCards.splice(source.index, 1);
      listCards.splice(destination.index, 0, moved);

      setCards({ ...cards, [sourceListId]: listCards });

      try {
        await cardService.updateCard(moved.id, {
          title: moved.title,
          description: moved.description,
          position: destination.index + 1,
        });
      } catch (err) {
        console.error('Failed to update card position', err);
      }
      return;
    }

    const sourceCards = Array.from(cards[sourceListId] || []);
    const destCards = Array.from(cards[destListId] || []);
    const [moved] = sourceCards.splice(source.index, 1);
    destCards.splice(destination.index, 0, moved);

    setCards({
      ...cards,
      [sourceListId]: sourceCards,
      [destListId]: destCards,
    });

    try {
      await cardService.updateCard(moved.id, {
        title: moved.title,
        description: moved.description,
        position: destination.index + 1,
        listId: destListId, 
      });
    } catch (err) {
      console.error('Failed to move card', err);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading board...</div>;

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col">
      <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/boards')} className="text-gray-500 hover:text-gray-800 font-medium">
            ← Back
          </button>
          <h1 className="text-xl font-bold text-gray-800">Board Workspace</h1>
        </div>
      </header>

      {error && <div className="bg-red-100 text-red-700 p-3 text-sm text-center">⚠️ {error}</div>}

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex-1 overflow-x-auto p-6 flex gap-6 items-start">
          {lists.map((list) => (
            <div key={list.id} className="bg-gray-100 rounded-xl w-72 flex-shrink-0 flex flex-col max-h-[calc(100vh-140px)]">
              <div className="flex justify-between items-center p-3 border-b border-gray-200">
                <h2 className="font-semibold text-gray-700">{list.title}</h2>
                <button onClick={() => handleDeleteList(list.id)} className="text-gray-400 hover:text-red-500 text-sm">✕</button>
              </div>

              <Droppable droppableId={String(list.id)}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="flex-1 overflow-y-auto p-2 space-y-2 min-h-[50px]"
                  >
                    {(cards[list.id] || []).map((card, index) => (
                      <Draggable key={card.id} draggableId={String(card.id)} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition group relative"
                          >
                            <h3 className="font-medium text-gray-800 text-sm">{card.title}</h3>
                            {card.description && <p className="text-xs text-gray-500 mt-1">{card.description}</p>}
                            <button
                              onClick={() => handleDeleteCard(card.id)}
                              className="absolute top-2 right-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
                            >
                              ✕
                            </button>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>

              <form onSubmit={(e) => handleAddCard(list.id, e)} className="p-2 border-t border-gray-200">
                <input
                  type="text"
                  placeholder="+ Add a card"
                  value={cardInputs[list.id] || ''}
                  onChange={(e) => setCardInputs({ ...cardInputs, [list.id]: e.target.value })}
                  className="w-full p-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </form>
            </div>
          ))}

          <div className="w-72 flex-shrink-0">
            <form onSubmit={handleAddList} className="bg-gray-100 rounded-xl p-3">
              <input
                type="text"
                placeholder="+ Add a new list"
                value={newListTitle}
                onChange={(e) => setNewListTitle(e.target.value)}
                className="w-full p-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </form>
          </div>
        </div>
      </DragDropContext>
    </div>
  );
}