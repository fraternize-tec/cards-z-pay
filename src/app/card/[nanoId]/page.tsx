'use client';

import { useEffect, useState } from 'react';
import { supabaseServer } from '@/lib/supabase-server';
import { formatBRL } from '@/lib/format';
import ThemeToggle from '@/components/ThemeToggle';
import Sponsors from '@/components/Sponsors';
import Link from 'next/link';

const PAGE_SIZE = 5;

export default function CardPage({
    params,
}: {
    params: Promise<{ nanoId: string }>;
}) {
    const [card, setCard] = useState<any>(null);
    const [extrato, setExtrato] = useState<any[]>([]);
    const [patrocinadores, setPatrocinadores] = useState<any[]>([]);
    const [saldoAnimado, setSaldoAnimado] = useState(0);

    useEffect(() => {
        async function load() {
            const { nanoId } = await params;

            const [
                { data: cardData },
                { data: extratoData },
                { data: patrocinadoresData },
            ] = await Promise.all([
                supabaseServer
                    .from('card_public_info')
                    .select('*')
                    .eq('nano_id', nanoId)
                    .maybeSingle(),

                supabaseServer.rpc('fn_card_public_extrato', {
                    p_nano_id: nanoId,
                    p_limit: PAGE_SIZE,
                }),

                supabaseServer
                    .from('card_public_patrocinadores')
                    .select('*')
                    .eq('nano_id', nanoId),
            ]);

            setCard(cardData);
            setExtrato(extratoData ?? []);
            setPatrocinadores(patrocinadoresData ?? []);
        }

        load();
    }, [params]);

    // 🎞 animação do saldo
    useEffect(() => {
        if (!card) return;

        let start = 0;
        const end = Number(card.saldo);
        const duration = 700;
        const step = 16;
        const increment = end / (duration / step);

        const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
                setSaldoAnimado(end);
                clearInterval(timer);
            } else {
                setSaldoAnimado(start);
            }
        }, step);

        return () => clearInterval(timer);
    }, [card]);

    /* ========================= */
    /* 🦴 SKELETON               */
    /* ========================= */
    if (!card) {
        return (
            <main className="app-container">
                <div className="card skeleton-card" />
                <div className="home-actions">
                    <div className="action-card skeleton-card" />
                    <div className="action-card skeleton-card" />
                </div>
            </main>
        );
    }

    return (
        <main className="app-container">
            {/* HEADER */}
            <header className="home-header">
                <div className="brand">
                    <div className="brand-logo">Z</div>
                    <span>Zpay</span>
                </div>
                <ThemeToggle />
            </header>

            {/* CARD PRINCIPAL */}
            <section className="card home-card">
                <div className="home-card-header">
                    <p className="title-sm">{card.evento_nome}</p>

                    <span
                        className={`card-status ${card.bloqueado ? 'blocked' : 'active'
                            }`}
                    >
                        <span className="card-status-dot" />
                        {card.bloqueado ? 'Bloqueado' : 'Ativo'}
                    </span>
                </div>

                <p className="text-muted card-code">
                    Cartão • {card.codigo_unico}
                </p>

                <div className="saldo-box">
                    <span className="text-muted">Saldo disponível</span>
                    <span className="saldo-valor animate-balance">
                        {formatBRL(saldoAnimado)}
                    </span>
                </div>
            </section>

            {/* AÇÕES */}
            <div className="home-actions">
                <Link
                    href={`/card/${card.nano_id}/extrato`}
                    className="action-card"
                >
                    <div className="action-icon">
                        <svg viewBox="0 0 24 24">
                            <path d="M6 2h9l5 5v15a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" />
                        </svg>
                    </div>
                    <strong>Extrato</strong><br />
                    <span>Ver movimentações</span>
                </Link>

                <Link
                    href={`/card/${card.nano_id}/cardapio`}
                    className="action-card"
                >
                    <div className="action-icon">
                        <svg viewBox="0 0 24 24">
                            <path d="M3 4h18v2H3zm0 7h18v2H3zm0 7h18v2H3z" />
                        </svg>
                    </div>
                    <strong>Cardápio</strong><br />
                    <span>Ver itens</span>
                </Link>
            </div>

            {/* ÚLTIMAS MOVIMENTAÇÕES */}
            {extrato.length > 0 && (
                <section className="section">
                    <div className="section-header">
                        <h2 className="title-sm">Últimas movimentações</h2>

                        <Link
                            href={`/card/${card.nano_id}/extrato`}
                            className="link-primary"
                        >
                            Ver extrato
                        </Link>
                    </div>

                    <div className="list">
                        {extrato.map(item => (
                            <div
                                key={item.operacao_id}
                                className="list-item extrato-row-home"
                            >
                                <div
                                    className={`tx-icon ${item.cancelado && item.cancelamento_tipo === 'total'
                                        ? 'cancelado'
                                        : item.tipo
                                        }`}
                                >
                                    {item.cancelado && item.cancelamento_tipo === 'total'
                                        ? '✕'
                                        : item.tipo === 'recarga'
                                            ? '↑'
                                            : item.tipo === 'devolucao'
                                                ? '↩'
                                                : '↓'}
                                </div>

                                {/* TEXTO */}
                                <div className="extrato-info-home">
                                    <strong>
                                        {item.tipo === 'recarga'
                                            ? 'Recarga'
                                            : item.tipo === 'taxa'
                                                ? 'Taxa de ativação'
                                                : item.tipo === 'devolucao'
                                                    ? 'Devolução'
                                                    : 'Consumo'}
                                    </strong>
                                    {item.cancelado && (
                                        <span className="cancel-badge">
                                            {item.cancelamento_tipo === 'parcial'
                                                ? 'Cancelado parcialmente'
                                                : 'Cancelado'}
                                        </span>
                                    )}
                                    <p className="text-muted">
                                        {new Date(item.criado_em).toLocaleString('pt-BR')}
                                    </p>
                                </div>

                                {/* VALOR */}
                                <div
                                    className={
                                        item.cancelado && item.cancelamento_tipo === 'total'
                                            ? 'value-cancelled'
                                            : item.valor >= 0
                                                ? 'value-positive'
                                                : 'value-negative'
                                    }
                                >
                                    {item.valor > 0 ? '+' : ''}
                                    {formatBRL(item.valor)}
                                </div>

                            </div>
                        ))}
                    </div>

                </section>
            )}

            {/* PATROCINADORES */}
            {patrocinadores.length > 0 && (
                <Sponsors patrocinadores={patrocinadores} />
            )}
        </main>
    );
}
