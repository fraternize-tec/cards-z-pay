import Cardapio from '@/components/Cardapio';
import { supabaseServer } from '@/lib/supabase-server';

export default async function CardapioPage({
  params,
}: {
  params: Promise<{ nanoId: string }>;
}) {
  const { nanoId } = await params;

  // 1️⃣ descobrir o evento do cartão
  const { data: card } = await supabaseServer
    .from('card_public_evento')
    .select('evento_id')
    .eq('nano_id', nanoId.trim())
    .maybeSingle();

  if (!card) {
    return (
      <main className="app-container">
        <p>Cartão não encontrado</p>
      </main>
    );
  }

  // 2️⃣ buscar cardápio pelo evento
  const { data: itens } = await supabaseServer
    .from('evento_cardapio')
    .select('*')
    .eq('evento_id', card.evento_id)
    .order('pdv_nome', { ascending: true })
    .order('nome', { ascending: true })

  return (
    <main className="app-container">
      <Cardapio itens={itens ?? []} />
    </main>
  );
}