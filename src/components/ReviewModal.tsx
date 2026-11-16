import React, { useState } from 'react';
import { ServiceTask, UserProfile, Review } from '../types';
import { X, Star, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ReviewModalProps {
  task: ServiceTask;
  provider: UserProfile;
  currentUser: UserProfile;
  onClose: () => void;
  onSubmitReview: (review: Review) => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  task,
  provider,
  currentUser,
  onClose,
  onSubmitReview
}) => {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([
    'Puntualitat excel·lent',
    'Molt professional'
  ]);

  const availableTags = [
    'Puntualitat excel·lent',
    'Molt professional',
    'Neteja i cura',
    'Preu acordat complert',
    'Gran comunicació',
    'Recomanable 100%'
  ];

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    const newReview: Review = {
      id: `rev_${Date.now()}`,
      taskId: task.id,
      serviceTitle: task.title,
      clientId: currentUser.id,
      clientName: currentUser.name,
      clientAvatar: currentUser.avatar,
      providerId: provider.id,
      rating,
      tags: selectedTags,
      comment: comment.trim() || 'Servei impecable i segons els termes acordats a FEINA X FEINA.',
      date: 'Avui'
    };

    onSubmitReview(newReview);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 dark:border-slate-800 transition-colors duration-200">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-amber-500 to-amber-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <Star className="w-5 h-5 fill-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm font-display">Valorar a {provider.name}</h3>
              <p className="text-xs text-amber-100">{task.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Provider snapshot */}
          <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700">
            <img
              src={provider.avatar}
              alt={provider.name}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-amber-300 dark:ring-amber-500"
            />
            <div>
              <div className="font-bold text-sm text-slate-900 dark:text-white font-display">{provider.name}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {task.municipality} · {task.category}
              </div>
            </div>
          </div>

          {/* Star selector */}
          <div className="text-center py-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              Com qualificaries la feina realitzada?
            </label>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => {
                const isFilled = (hoverRating || rating) >= star;
                return (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    className="p-1.5 focus:outline-none transition-transform hover:scale-125"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        isFilled
                          ? 'fill-amber-400 text-amber-500'
                          : 'text-slate-300 dark:text-slate-700'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
            <div className="text-xs font-bold text-amber-700 dark:text-amber-400 mt-1">
              {rating === 5 && '¡Excel·lent treball! (5/5)'}
              {rating === 4 && 'Molt bon servei (4/5)'}
              {rating === 3 && 'Correcte (3/5)'}
              {rating <= 2 && 'Millorable'}
            </div>
          </div>

          {/* Tag pills */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Aspectes destacats del professional
            </label>
            <div className="flex flex-wrap gap-1.5">
              {availableTags.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
                      isSelected
                        ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-700'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    <span>{tag}</span>
                    {isSelected && <Check className="w-3 h-3 text-amber-700 dark:text-amber-400" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Comentari públic per a altres usuaris de Mallorca
            </label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Explica com ha anat l'experiència, puntualitat i acabats..."
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-amber-600 hover:bg-amber-700 active:scale-[0.99] text-white rounded-xl font-bold text-xs transition-all shadow-md flex items-center justify-center gap-1.5"
          >
            <Star className="w-4 h-4 fill-white" />
            <span>Publicar Valoració</span>
          </button>
        </form>

      </div>
    </div>
  );
};
