'use client';

export default function MessagesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Messagerie</h1>
      
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <div className="text-6xl mb-4">💬</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Aucun message pour le moment</h2>
        <p className="text-gray-600">Commencez une conversation en envoyant un message à un prestataire</p>
      </div>
    </div>
  );
}
