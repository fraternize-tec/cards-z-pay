import Cardapio from '@/components/Cardapio';
import { supabaseServer } from '@/lib/supabase-server';

export default async function CardapioPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;

  // 🔹 buscar evento
  const { data: evento } = await supabaseServer
    .from('evento_publico')
    .select('id, nome, localidade, inicio, fim')
    .eq('id', eventId)
    .maybeSingle();

  // 🔹 buscar cardápio
  const { data: itens } = await supabaseServer
    .from('evento_cardapio')
    .select('*')
    .eq('evento_id', eventId)
    .order('pdv_nome', { ascending: true })
    .order('nome', { ascending: true });

  return (
    <main className="app-container">
      {/* HEADER DO EVENTO */}
      {evento && (
        <section className="card card-hover" style={{ marginBottom: 10 }}>
          <div className="card-meta">
            <p className="title-md">{evento.nome}</p>

            {evento.localidade && (
              <p className="text-muted">{evento.localidade}</p>
            )}
          </div>
        </section>
      )}

      {/* CARDÁPIO */}
      <Cardapio itens={itens ?? []} showBackButton={false} />
    </main>
  );
}