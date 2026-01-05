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

    return (
        <main className="app-container">

            {/* HEADER */}
            <header className="section" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                    <h1 className="title-md">{card.evento_nome}</h1>
                    <p className="text-muted">Cartão • {card.codigo_unico}</p>
                </div>

                <ThemeToggle />
            </header>


            {/* SALDO */}
            <section className="section card">
                <p className="text-muted">Saldo disponível</p>
                <p className="text-primary" style={{ fontSize: '2.5rem' }}>
                    {formatBRL(card.saldo)}
                </p>
            </section>

            {/* CARDÁPIO */}
            <Cardapio itens={itens ?? []} />

            {/* PATROCINADORES */}
            {patrocinadores?.length > 0 && (
                <Sponsors patrocinadores={patrocinadores} />
            )}

            {/* EXTRATO */}
            <ExtratoPaginated
                initialData={extrato ?? []}
                nanoId={nanoId}
                pageSize={PAGE_SIZE}
            />
        </main>
    );
}