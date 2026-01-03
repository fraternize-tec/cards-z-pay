export default function Loading() {
  return (
    <main className="max-w-md mx-auto p-4 space-y-8 animate-pulse">
      {/* Header */}
      <div className="space-y-2">
        <div className="h-6 w-2/3 bg-gray-200 rounded" />
        <div className="h-4 w-1/3 bg-gray-200 rounded" />
      </div>

      {/* Saldo */}
      <div className="h-28 bg-gray-300 rounded-2xl" />

      {/* Cardápio */}
      <div className="space-y-3">
        <div className="h-5 w-1/3 bg-gray-200 rounded" />
        <div className="space-y-2">
          <div className="h-12 bg-gray-200 rounded-xl" />
          <div className="h-12 bg-gray-200 rounded-xl" />
          <div className="h-12 bg-gray-200 rounded-xl" />
        </div>
      </div>

      {/* Extrato */}
      <div className="space-y-3">
        <div className="h-5 w-1/2 bg-gray-200 rounded" />
        <div className="space-y-2">
          <div className="h-14 bg-gray-200 rounded-xl" />
          <div className="h-14 bg-gray-200 rounded-xl" />
          <div className="h-14 bg-gray-200 rounded-xl" />
        </div>
      </div>
    </main>
  );
}
