'use client';

import { useState } from 'react';
import { formatBRL } from '@/lib/format';

export default function CardapioFiltro({ itens }: { itens: any[] }) {
  const [busca, setBusca] = useState('');

  const filtrados = itens.filter(i =>
    i.nome.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <>
      <input
        placeholder="Buscar item..."
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        className="input"
      />

      <div className="list">
        {filtrados.map(item => (
          <div key={item.id} className="list-item">
            <span>{item.nome}</span>
            <span className="text-primary">
              {formatBRL(item.preco_padrao)}
            </span>
          </div>
        ))}
      </div>
    </>
  );
}
