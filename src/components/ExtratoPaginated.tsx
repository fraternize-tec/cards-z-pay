'use client';

import { useState } from 'react';
import { supabaseServer } from '@/lib/supabase-server';
import { formatBRL } from '@/lib/format';

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

      <div className="list">
        {items.map((item, index) => {
          const isRecarga = item.tipo === 'recarga';

          return (
            <div key={index} className="list-item" style={{ gap: 12 }}>
              {/* Ícone */}
              <div className={`tx-icon ${isRecarga ? 'recarga' : 'consumo'}`}>
                {isRecarga ? '⬆︎' : '⬇︎'}
              </div>

              {/* Texto */}
              <div style={{ flex: 1 }}>
                <p className="title-sm">
                  {isRecarga ? 'Recarga' : 'Consumo'}
                </p>
                <p className="text-muted">
                  {new Date(item.criado_em).toLocaleString('pt-BR')}
                </p>
              </div>

              {/* Valor */}
              <span className={isRecarga ? 'value-positive' : 'value-negative'}>
                {isRecarga ? '+' : '-'} {formatBRL(item.valor)}
              </span>
            </div>

          );
        })}
      </div>

      {hasMore && (
        <button
          onClick={loadMore}
          disabled={loading}
          className="button"
        >
          {loading ? 'Carregando...' : 'Carregar mais'}
        </button>
      )}

    </section>
  );
}
