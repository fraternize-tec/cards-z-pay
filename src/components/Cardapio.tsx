'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { formatBRL } from '@/lib/format';

export default function Cardapio({ itens }: { itens: any[] }) {

  type Item = {
    id: string
    nome: string
    preco: number
    pdv_id: string | null
    pdv_nome: string | null
  }

  const router = useRouter()
  const [busca, setBusca] = useState('')
  const [quantidades, setQuantidades] = useState<Record<string, number>>({})
  const [abertos, setAbertos] = useState<Record<string, boolean>>({})

  const totalItens = Object.values(quantidades).reduce((a, b) => a + b, 0)

  function togglePdv(pdv: string) {
    setAbertos(s => ({
      ...s,
      [pdv]: !s[pdv]
    }))
  }

  const filtrados = itens.filter(i =>
    i.nome.toLowerCase().includes(busca.toLowerCase())
  )

  const agrupado: Record<string, Item[]> = filtrados.reduce((acc, item) => {
    const key = item.pdv_nome ?? 'Outros'

    if (!acc[key]) acc[key] = []

    acc[key].push(item)

    return acc
  }, {})

  function add(id: string) {
    setQuantidades(q => ({
      ...q,
      [id]: (q[id] ?? 0) + 1
    }))
  }

  function remove(id: string) {
    setQuantidades(q => {
      const atual = q[id] ?? 0
      if (atual <= 1) {
        const copy = { ...q }
        delete copy[id]
        return copy
      }
      return { ...q, [id]: atual - 1 }
    })
  }

  const total = itens.reduce((sum, item) => {
    const qtd = quantidades[item.id] ?? 0
    return sum + qtd * item.preco
  }, 0)

  return (
    <>
      {/* TOPBAR */}
      <div className="cardapio-topbar">

        <button className="back-btn" onClick={() => router.back()}>
          ← Voltar
        </button>

        <div className="search-box">
          <span>🔍</span>
          <input
            placeholder="Buscar item"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>

      </div>

      {/* LISTA POR PDV */}
      {Object.entries(agrupado).map(([pdv, items]) => {

        const aberto = abertos[pdv] ?? true

        return (
          <div key={pdv} className="cardapio-group">

            <div
              className="pdv-header"
              onClick={() => togglePdv(pdv)}
            >
              <span>{pdv}</span>

              <span className="pdv-toggle">
                {aberto ? '▾' : '▸'}
              </span>
            </div>

            {aberto && (
              <div className="cardapio-list">
                {items.map(item => {
                  const qtd = quantidades[item.id] ?? 0

                  return (
                    <div key={item.id} className="cardapio-item">

                      <div className="item-info">
                        <span className="item-name">{item.nome}</span>
                        <span className="item-price">
                          {formatBRL(item.preco)}
                        </span>
                      </div>

                      <div className="item-actions">

                        <button
                          className="qty-btn minus"
                          onClick={() => remove(item.id)}
                          disabled={qtd === 0}
                        >
                          −
                        </button>

                        <span className="qty">{qtd}</span>

                        <button
                          className="qty-btn plus"
                          onClick={() => add(item.id)}
                        >
                          +
                        </button>

                      </div>

                    </div>
                  )
                })}
              </div>
            )}

          </div>
        )
      })}

      {/* BARRA TOTAL */}
      {/* BARRA TOTAL */}
      {total > 0 && (
        <div className="cart-bar">

          <div className="cart-content">

            <div className="cart-info">
              <span className="cart-title">Simulação do pedido</span>

              <div className="cart-meta">
                <span className="cart-items">{totalItens} itens</span>

                <button
                  className="cart-clear"
                  onClick={() => setQuantidades({})}
                >
                  Limpar
                </button>
              </div>
            </div>

            <div className="cart-total">
              {formatBRL(total)}
            </div>

          </div>

        </div>
      )}
    </>
  )
}