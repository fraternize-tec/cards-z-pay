import ExtratoList from '@/components/ExtratoList';
import { supabaseServer } from '@/lib/supabase-server';

export default async function ExtratoPage({
  params,
}: {
  params: Promise<{ nanoId: string }>;
}) {
  const { nanoId } = await params; 

  const { data: extrato } = await supabaseServer
    .from('card_public_extrato')
    .select('*')
    .eq('nano_id', nanoId)
    .order('criado_em', { ascending: false });

  if (!extrato || extrato.length === 0) {
    return (
      <main className="app-container">
        <p className="text-muted">Nenhuma movimentação encontrada.</p>
      </main>
    );
  }

  return (
    <main className="app-container">
      <h1 className="title-sm">Extrato completo</h1>

      <ExtratoList
        nanoId={nanoId}
        items={extrato}
      />
    </main>
  );
}
