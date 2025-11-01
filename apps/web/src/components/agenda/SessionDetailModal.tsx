'use client';

import { useState } from 'react';
import { Session, SessionDocument, SessionQuestion, SessionFeedback } from '@/types/agenda';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  Clock,
  MapPin,
  Users,
  Star,
  FileText,
  Download,
  MessageCircle,
  ThumbsUp,
  Heart,
  Calendar,
  X,
  Send,
  Upload,
} from 'lucide-react';

interface SessionDetailModalProps {
  session: Session;
  isOpen: boolean;
  onClose: () => void;
  onAddToAgenda?: (sessionId: string) => void;
  onRemoveFromAgenda?: (sessionId: string) => void;
}

export default function SessionDetailModal({
  session,
  isOpen,
  onClose,
  onAddToAgenda,
  onRemoveFromAgenda,
}: SessionDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'qa' | 'feedback'>('details');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [question, setQuestion] = useState('');

  if (!isOpen) return null;

  const startTime = new Date(session.startTime);
  const endTime = new Date(session.endTime);
  const duration = Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60));

  const trackColor = session.track?.couleur || '#3B82F6';

  const averageRating = session.feedbackStats?.averageRating || 0;
  const totalFeedbacks = session.feedbackStats?.totalFeedbacks || 0;

  const handleSubmitFeedback = () => {
    // TODO: API call to submit feedback
    console.log('Submit feedback:', { sessionId: session.id, rating, feedbackComment });
    setRating(0);
    setFeedbackComment('');
  };

  const handleSubmitQuestion = () => {
    // TODO: API call to submit question
    console.log('Submit question:', { sessionId: session.id, question });
    setQuestion('');
  };

  const handleToggleAgenda = () => {
    if (session.isInMyAgenda) {
      onRemoveFromAgenda?.(session.id);
    } else {
      onAddToAgenda?.(session.id);
    }
  };

  const handleLikeQuestion = (questionId: string) => {
    // TODO: API call to like question
    console.log('Like question:', questionId);
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  const getFileIcon = (type: SessionDocument['type']) => {
    switch (type) {
      case 'pdf':
        return '📄';
      case 'pptx':
        return '📊';
      case 'docx':
        return '📝';
      case 'xlsx':
        return '📈';
      case 'video':
        return '🎥';
      case 'link':
        return '🔗';
      default:
        return '📎';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Overlay */}
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

        {/* Modal */}
        <div className="relative w-full max-w-4xl rounded-xl bg-white shadow-2xl">
          {/* Header with track color */}
          <div
            className="rounded-t-xl px-6 py-4"
            style={{ background: `linear-gradient(135deg, ${trackColor}15 0%, ${trackColor}05 100%)` }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                {session.track && (
                  <div className="mb-2 flex items-center gap-2">
                    <span className="text-xl">{session.track.icon}</span>
                    <span className="text-sm font-medium" style={{ color: trackColor }}>
                      {session.track.nom}
                    </span>
                  </div>
                )}
                <h2 className="text-2xl font-bold text-gray-900">{session.title}</h2>
                <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    {format(startTime, 'HH:mm', { locale: fr })} - {format(endTime, 'HH:mm', { locale: fr })}
                    <span className="ml-1 text-gray-400">({duration} min)</span>
                  </div>
                  {session.venueRoom && (
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4" />
                      {session.venueRoom.name}
                    </div>
                  )}
                  {session.maxCapacity && (
                    <div className="flex items-center gap-1.5">
                      <Users className="h-4 w-4" />
                      {session.currentRegistrations || 0} / {session.maxCapacity}
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Actions bar */}
          <div className="border-b border-gray-200 px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {averageRating > 0 && (
                  <div className="flex items-center gap-1.5 rounded-full bg-yellow-50 px-3 py-1.5 text-sm">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-yellow-700">{averageRating.toFixed(1)}</span>
                    <span className="text-gray-500">({totalFeedbacks})</span>
                  </div>
                )}
                {session._count?.questions && session._count.questions > 0 && (
                  <div className="flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-sm">
                    <MessageCircle className="h-4 w-4 text-blue-600" />
                    <span className="font-semibold text-blue-700">{session._count.questions}</span>
                    <span className="text-gray-500">questions</span>
                  </div>
                )}
              </div>
              <button
                onClick={handleToggleAgenda}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition-colors ${
                  session.isInMyAgenda
                    ? 'bg-red-50 text-red-600 hover:bg-red-100'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {session.isInMyAgenda ? (
                  <>
                    <Heart className="h-4 w-4 fill-current" />
                    Retirer de mon agenda
                  </>
                ) : (
                  <>
                    <Calendar className="h-4 w-4" />
                    Ajouter à mon agenda
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex px-6">
              <button
                onClick={() => setActiveTab('details')}
                className={`border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'details'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                Détails
              </button>
              {session.interactions?.qaActive && (
                <button
                  onClick={() => setActiveTab('qa')}
                  className={`border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === 'qa'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  Questions ({session._count?.questions || 0})
                </button>
              )}
              <button
                onClick={() => setActiveTab('feedback')}
                className={`border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'feedback'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                Évaluation ({totalFeedbacks})
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="max-h-[60vh] overflow-y-auto p-6">
            {/* DETAILS TAB */}
            {activeTab === 'details' && (
              <div className="space-y-6">
                {/* Description */}
                {session.description && (
                  <div>
                    <h3 className="mb-2 font-semibold text-gray-900">Description</h3>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">{session.description}</p>
                  </div>
                )}

                {/* Speakers */}
                {session.speakers && session.speakers.length > 0 && (
                  <div>
                    <h3 className="mb-3 flex items-center gap-2 font-semibold text-gray-900">
                      <Users className="h-5 w-5" />
                      Orateurs
                    </h3>
                    <div className="space-y-4">
                      {session.speakers.map((speaker) => (
                        <div key={speaker.id} className="flex gap-4 rounded-lg bg-gray-50 p-4">
                          {speaker.photo ? (
                            <img
                              src={speaker.photo}
                              alt={speaker.name}
                              className="h-16 w-16 rounded-full object-cover"
                            />
                          ) : (
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-xl font-semibold text-blue-600">
                              {speaker.name.charAt(0)}
                            </div>
                          )}
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{speaker.name}</h4>
                            {speaker.title && <p className="text-sm text-gray-600">{speaker.title}</p>}
                            {speaker.company && <p className="text-sm text-gray-500">{speaker.company}</p>}
                            {speaker.bio && <p className="mt-2 text-sm text-gray-700">{speaker.bio}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Documents */}
                {session.documents && session.documents.length > 0 && (
                  <div>
                    <h3 className="mb-3 flex items-center gap-2 font-semibold text-gray-900">
                      <FileText className="h-5 w-5" />
                      Documents
                    </h3>
                    <div className="space-y-2">
                      {session.documents.map((doc) => (
                        <a
                          key={doc.id}
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 transition-colors hover:bg-gray-50"
                        >
                          <span className="text-2xl">{getFileIcon(doc.type)}</span>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{doc.nom}</p>
                            {doc.description && <p className="text-xs text-gray-500">{doc.description}</p>}
                          </div>
                          {doc.taille && <span className="text-xs text-gray-400">{formatFileSize(doc.taille)}</span>}
                          <Download className="h-4 w-4 text-gray-400" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Logistique */}
                {session.logistique && (
                  <div>
                    <h3 className="mb-2 font-semibold text-gray-900">Logistique</h3>
                    <div className="rounded-lg bg-gray-50 p-4 space-y-2 text-sm">
                      {session.logistique.ressources && session.logistique.ressources.length > 0 && (
                        <div>
                          <span className="font-medium">Ressources : </span>
                          {session.logistique.ressources.join(', ')}
                        </div>
                      )}
                      {session.logistique.instructions && (
                        <div>
                          <span className="font-medium">Instructions : </span>
                          {session.logistique.instructions}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Q&A TAB */}
            {activeTab === 'qa' && (
              <div className="space-y-6">
                {/* Submit question form */}
                <div className="rounded-lg border-2 border-dashed border-gray-200 p-4">
                  <h3 className="mb-3 font-semibold text-gray-900">Poser une question</h3>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      placeholder="Votre question..."
                      className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <button
                      onClick={handleSubmitQuestion}
                      disabled={!question.trim()}
                      className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:bg-gray-300"
                    >
                      <Send className="h-4 w-4" />
                      Envoyer
                    </button>
                  </div>
                </div>

                {/* Questions list */}
                <div className="space-y-3">
                  {session.questions && session.questions.length > 0 ? (
                    session.questions
                      .sort((a, b) => b.likes - a.likes)
                      .map((q) => (
                        <div key={q.id} className="rounded-lg border border-gray-200 p-4">
                          <div className="flex gap-3">
                            {q.participantPhoto ? (
                              <img
                                src={q.participantPhoto}
                                alt={q.participantName || ''}
                                className="h-10 w-10 rounded-full"
                              />
                            ) : (
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-sm font-semibold text-gray-600">
                                {q.participantName?.charAt(0) || '?'}
                              </div>
                            )}
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-gray-900">{q.participantName || 'Anonyme'}</span>
                                <span className="text-xs text-gray-400">
                                  {format(new Date(q.createdAt), 'dd MMM yyyy HH:mm', { locale: fr })}
                                </span>
                              </div>
                              <p className="mt-1 text-gray-700">{q.question}</p>
                              {q.isAnswered && q.reponse && (
                                <div className="mt-2 rounded-lg bg-green-50 p-3 text-sm">
                                  <span className="font-medium text-green-800">Réponse : </span>
                                  <span className="text-green-700">{q.reponse}</span>
                                </div>
                              )}
                            </div>
                            <button
                              onClick={() => handleLikeQuestion(q.id)}
                              className="flex items-center gap-1 rounded-lg px-3 py-1 transition-colors hover:bg-gray-100"
                            >
                              <ThumbsUp className="h-4 w-4 text-gray-400" />
                              <span className="text-sm font-medium text-gray-600">{q.likes}</span>
                            </button>
                          </div>
                        </div>
                      ))
                  ) : (
                    <p className="py-8 text-center text-gray-500">Aucune question pour le moment</p>
                  )}
                </div>
              </div>
            )}

            {/* FEEDBACK TAB */}
            {activeTab === 'feedback' && (
              <div className="space-y-6">
                {/* Submit feedback form */}
                <div className="rounded-lg border-2 border-dashed border-gray-200 p-4">
                  <h3 className="mb-3 font-semibold text-gray-900">Évaluer cette session</h3>
                  <div className="space-y-4">
                    {/* Star rating */}
                    <div>
                      <p className="mb-2 text-sm text-gray-600">Votre note :</p>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            onClick={() => setRating(star)}
                            className="transition-transform hover:scale-110"
                          >
                            <Star
                              className={`h-8 w-8 ${
                                star <= (hoverRating || rating)
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    {/* Comment */}
                    <div>
                      <label className="mb-2 block text-sm text-gray-600">Commentaire (optionnel) :</label>
                      <textarea
                        value={feedbackComment}
                        onChange={(e) => setFeedbackComment(e.target.value)}
                        placeholder="Partagez votre avis sur cette session..."
                        rows={3}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <button
                      onClick={handleSubmitFeedback}
                      disabled={rating === 0}
                      className="w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:bg-gray-300"
                    >
                      Soumettre mon évaluation
                    </button>
                  </div>
                </div>

                {/* Feedbacks list */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900">Avis des participants ({totalFeedbacks})</h3>
                  {session.feedbacks && session.feedbacks.length > 0 ? (
                    session.feedbacks.map((feedback) => (
                      <div key={feedback.id} className="rounded-lg border border-gray-200 p-4">
                        <div className="mb-2 flex items-center gap-2">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${
                                  star <= feedback.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-gray-400">
                            {format(new Date(feedback.createdAt), 'dd MMM yyyy', { locale: fr })}
                          </span>
                        </div>
                        {feedback.commentaire && <p className="text-gray-700">{feedback.commentaire}</p>}
                      </div>
                    ))
                  ) : (
                    <p className="py-8 text-center text-gray-500">Aucun avis pour le moment</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
