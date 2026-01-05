import { supabaseServer } from '@/lib/supabase-server';
import ExtratoPaginated from '@/components/ExtratoPaginated';
import Cardapio from '@/components/Cardapio';
import Sponsors from '@/components/Sponsors';
import { formatBRL } from '@/lib/format';
import ThemeToggle from '@/components/ThemeToggle';

const PAGE_SIZE = 5;

export default async function CardPage({
    params,
}: {
    params: Promise<{ nanoId: string }>;
}) {
    const { nanoId } = await params;

    const [
        { data: card },
        { data: extrato },
        { data: itens },
        { data: patrocinadores },
    ] = await Promise.all([
        supabaseServer
            .from('card_public_info')
            .select('*')
            .eq('nano_id', nanoId.trim())
            .maybeSingle(),

        supabaseServer
            .from('card_public_extrato')
            .select('*')
            .eq('nano_id', nanoId.trim())
            .order('criado_em', { ascending: false })
            .range(0, PAGE_SIZE - 1),

        supabaseServer
            .from('card_public_itens')
            .select('*')
            .eq('nano_id', nanoId.trim())
            .order('nome'),

        supabaseServer
            .from('card_public_patrocinadores')
            .select('*')
            .eq('nano_id', nanoId.trim()),
    ]);

    if (!card) {
        return (
            <div className="h-screen flex items-center justify-center">
                <p className="text-red-500">Cartão não encontrado</p>
            </div>
        );
    }

    const safeExtrato = extrato ?? [];
    const safeItens = itens ?? [];
    const safePatrocinadores = patrocinadores ?? [];

    return (
        <main className="app-container">

            {/* HEADER */}
            <header className="section" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div className="card-header">
                    <div className="brand">
                        <div className="brand-logo">Z</div>
                        <span>Zpay</span>
                    </div>
                </div>

                <ThemeToggle />
            </header>


            <section className="section card card-hover">
                {/* Header do card */}


                {/* Informações do cartão */}
                <div className="card-meta">
                    <p className="title-sm">{card.evento_nome}</p>

                    <p className="text-muted card-code">
                        Cartão • {card.codigo_unico}
                    </p>

                    <span
                        className={`card-status ${card.bloqueado ? 'blocked' : 'active'
                            }`}
                    >
                        <span className="card-status-dot" />
                        {card.bloqueado ? 'Bloqueado' : 'Ativo'}
                    </span>
                </div>

                {/* Saldo */}
                <div>
                    <p className="text-muted">Saldo disponível</p>
                    <p className="text-primary" style={{ fontSize: '2.75rem' }}>
                        {formatBRL(card.saldo)}
                    </p>
                </div>

            </section>


            {/* CARDÁPIO */}
            <Cardapio itens={safeItens ?? []} />

            {/* PATROCINADORES */}
            {safePatrocinadores.length > 0 && (
                <Sponsors patrocinadores={safePatrocinadores} />
            )}

            {/* EXTRATO */}
            <ExtratoPaginated
                initialData={safeExtrato ?? []}
                nanoId={nanoId}
                pageSize={PAGE_SIZE}
            />
        </main>
    );
}