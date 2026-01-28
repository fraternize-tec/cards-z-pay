'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { formatBRL } from '@/lib/format';

export default function Cardapio({
  itens,
}: {
  itens: any[];
}) {
  const router = useRouter();
  const [busca, setBusca] = useState('');

  const filtrados = itens.filter(i =>
    i.nome.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <>
      {/* 🔝 TOPBAR */}
      <div className="cardapio-topbar">
        <button
          className="back-btn"
          onClick={() => router.back()}
        >
          ← Voltar
        </button>

        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            placeholder="Buscar item"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>
      </div>

      {/* 🍔 LISTA */}
      <div className="cardapio-list">
        {filtrados.map(item => (
          <div key={item.id} className="cardapio-item">
            <span className="item-name">{item.nome}</span>
            <span className="item-price">
              {formatBRL(item.preco_padrao)}
            </span>
          </div>
        ))}
      </div>
    </>
  );
}
