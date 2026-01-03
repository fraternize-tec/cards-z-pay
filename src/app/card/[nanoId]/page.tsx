import { supabaseServer } from '@/lib/supabase-server';
import ExtratoPaginated from '@/components/ExtratoPaginated';
import Cardapio from '@/components/Cardapio';
import Sponsors from '@/components/Sponsors';

const PAGE_SIZE = 20;

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
        <main className="max-w-md mx-auto p-4 space-y-8">
            {/* HEADER */}
            <header>
                <h1 className="text-xl font-semibold">{card.evento_nome}</h1>
                <p className="text-sm text-gray-500">
                    Cartão • {card.codigo_unico}
                </p>
            </header>

            {/* SALDO */}
            <section className="bg-gray-900 text-white rounded-2xl p-6">
                <p className="text-sm opacity-80">Saldo disponível</p>
                <p className="text-4xl font-bold">
                    R$ {Number(card.saldo).toFixed(2)}
                </p>
            </section>

            {/* CARDÁPIO */}
            <Cardapio itens={itens ?? []} />

            {patrocinadores && patrocinadores.length > 0 && (
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
