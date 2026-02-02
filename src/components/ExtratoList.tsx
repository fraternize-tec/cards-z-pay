'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { formatBRL } from '@/lib/format';
import { supabaseServer } from '@/lib/supabase-server';

type Item = {
    operacao_id: string;
    tipo: 'recarga' | 'consumo' | 'taxa';
    valor: number;
    criado_em: string;
    cancelado: boolean;
    cancelado_em?: string;
};

type DetalheOperacao = {
    operacao_id: string;
    tipo: 'recarga' | 'consumo';
    valor: number;
    criado_em: string;
    cancelado: boolean;
    cancelado_em?: string;
    detalhes: any;
};


export default function ExtratoList({
    nanoId,
    items,
}: {
    nanoId: string;
    items: Item[];
}) {
    const router = useRouter();

    const [filtro, setFiltro] =
        useState<'todos' | 'recarga' | 'consumo' | 'taxa'>('todos');

    const [aberto, setAberto] = useState<string | null>(null);
    const [detalhe, setDetalhe] = useState<DetalheOperacao | null>(null);
    const [loading, setLoading] = useState(false);

    const filtrados = items.filter(i =>
        filtro === 'todos' ? true : i.tipo === filtro
    );

    async function toggle(item: Item) {
        if (aberto === item.operacao_id) {
            setAberto(null);
            setDetalhe(null);
            return;
        }

        setAberto(item.operacao_id);
        setLoading(true);

        const { data } = await supabaseServer
            .from('card_public_operacao_detalhe')
            .select('*')
            .eq('nano_id', nanoId)
            .eq('operacao_id', item.operacao_id)
            .maybeSingle();

        setDetalhe(data);
        setLoading(false);
    }

    return (
        <>
            {/* 🔝 TOPBAR */}
            <div className="extrato-topbar">
                <button
                    className="back-btn"
                    onClick={() => router.back()}
                >
                    ← Voltar
                </button>

                <div className="filter-pills">
                    {['todos', 'recarga', 'consumo'].map(t => (
                        <button
                            key={t}
                            className={filtro === t ? 'active' : ''}
                            onClick={() => setFiltro(t as any)}
                        >
                            {t === 'todos'
                                ? 'Todos'
                                : t === 'recarga'
                                    ? 'Entradas'
                                    : 'Saídas'}
                        </button>
                    ))}
                </div>
            </div>

            {/* 📋 LISTA */}
            <div className="extrato-list">
                {filtrados.map(item => {
                    const abertoAqui = aberto === item.operacao_id;

                    return (
                        <div
                            key={item.operacao_id}
                            className={`extrato-item ${item.cancelado ? 'cancelado' : ''}`}
                        >
                            <div
                                className="extrato-row"
                                onClick={() => toggle(item)}
                            >
                                <div className={`tx-icon ${item.cancelado ? 'cancelado' : item.tipo}`}>
                                    {item.cancelado ? '✕' : item.tipo === 'recarga' ? '↑' : '↓'}
                                </div>

                                <div className="extrato-info">
                                    <strong>
                                        {item.tipo === 'recarga'
                                            ? 'Recarga'
                                            : item.tipo === 'taxa'
                                                ? 'Taxa de ativação'
                                                : 'Consumo'}
                                    </strong>
                                    {item.cancelado && (
                                        <span className="cancel-badge">
                                            Cancelado
                                        </span>
                                    )}
                                    <span>
                                        {new Date(item.criado_em).toLocaleString('pt-BR')}
                                    </span>
                                </div>

                                <div
                                    className={
                                        item.cancelado
                                            ? 'value-cancelled'
                                            : item.tipo === 'recarga'
                                                ? 'value-positive'
                                                : 'value-negative'
                                    }
                                >
                                    {item.cancelado ? '' : item.tipo === 'recarga' ? '+' : '-'}
                                    {formatBRL(item.valor)}
                                </div>
                            </div>

                            {/* 🔽 DETALHE */}
                            {abertoAqui && (
                                <div className="expand-wrapper">
                                    <div className="expand-content">
                                        {loading && (
                                            <div className="expand-skeleton">
                                                <div className="skeleton-line" />
                                                <div className="skeleton-line" />
                                                <div className="skeleton-line short" />
                                            </div>
                                        )}

                                        {!loading && detalhe?.cancelado && (
                                            <div className="expand-cancelado">
                                                Operação cancelada em{' '}
                                                <strong>
                                                    {new Date(detalhe.cancelado_em!).toLocaleString('pt-BR')}
                                                </strong>
                                            </div>
                                        )}


                                        {!loading && detalhe?.tipo === 'recarga' && (
                                            <div className="expand-card">
                                                <span className="expand-title">Forma de pagamento</span>
                                                <div className="expand-highlight">
                                                    {detalhe.detalhes.forma_pagamento}
                                                </div>
                                            </div>
                                        )}

                                        {!loading && item.tipo === 'taxa' && (
                                            <div className="expand-card">
                                                <span className="expand-title">
                                                    Taxa de ativação do cartão
                                                </span>

                                                <div className="expand-highlight">
                                                    Cobrada na primeira recarga
                                                </div>
                                            </div>
                                        )}

                                        {!loading && detalhe?.tipo === 'consumo' && (
                                            <div className="expand-card">
                                                <span className="expand-title">Itens consumidos</span>

                                                <div className="expand-items">
                                                    {detalhe.detalhes.map((i: any, idx: number) => (
                                                        <div key={idx} className="expand-item">
                                                            <span>
                                                                {i.quantidade}x {i.item}
                                                            </span>
                                                            <strong>
                                                                {formatBRL(i.valor_total)}
                                                            </strong>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                        </div>
                    );
                })}
            </div>
        </>
    );
}
