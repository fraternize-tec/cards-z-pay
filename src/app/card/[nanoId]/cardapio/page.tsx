// app/client/[nanoId]/cardapio/page.tsx

import Cardapio from '@/components/Cardapio';
import { supabaseServer } from '@/lib/supabase-server';

export default async function CardapioPage({
  params,
}: {
  params: Promise<{ nanoId: string }>;
}) {
  const { nanoId } = await params;

  const { data: itens } = await supabaseServer
    .from('card_public_itens')
    .select('*')
    .eq('nano_id', nanoId)
    .order('nome');

  return (
    <main className="app-container">
      <Cardapio itens={itens ?? []} />
    </main>
  );
}
