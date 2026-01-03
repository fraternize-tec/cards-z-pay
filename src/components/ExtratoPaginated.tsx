'use client';

import { useState } from 'react';
import { supabaseServer } from '@/lib/supabase-server';

type ExtratoItem = {
  tipo: 'recarga' | 'consumo';
  valor: number;
  criado_em: string;
};

export default function ExtratoPaginated({
  initialData,
  nanoId,
  pageSize,
}: {
  initialData: ExtratoItem[];
  nanoId: string;
  pageSize: number;
}) {
  const [items, setItems] = useState<ExtratoItem[]>(initialData);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(
    initialData.length === pageSize
  );

  async function loadMore() {
    setLoading(true);

    const from = page * pageSize;
    const to = from + pageSize - 1;

    const { data } = await supabaseServer
      .from('card_public_extrato')
      .select('*')
      .eq('nano_id', nanoId)
      .order('criado_em', { ascending: false })
      .range(from, to);

    if (data && data.length > 0) {
      setItems((prev) => [...prev, ...data]);
      setPage((p) => p + 1);

      if (data.length < pageSize) {
        setHasMore(false);
      }
    } else {
      setHasMore(false);
    }

    setLoading(false);
  }

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold">Movimentações</h2>

      <div className="divide-y">
        {items.map((item, index) => {
          const isRecarga = item.tipo === 'recarga';

          return (
            <div key={index} className="flex justify-between py-3">
              <div>
                <p className="font-medium capitalize">
                  {isRecarga ? 'Recarga' : 'Consumo'}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(item.criado_em).toLocaleString('pt-BR')}
                </p>
              </div>

              <p
                className={`font-semibold ${
                  isRecarga ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {isRecarga ? '+' : '-'} R$ {item.valor.toFixed(2)}
              </p>
            </div>
          );
        })}
      </div>

      {hasMore && (
        <button
          onClick={loadMore}
          disabled={loading}
          className="w-full py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
        >
          {loading ? 'Carregando...' : 'Carregar mais'}
        </button>
      )}
    </section>
  );
}
