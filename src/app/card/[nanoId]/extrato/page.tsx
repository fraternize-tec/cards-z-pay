import ExtratoList from '@/components/ExtratoList';
import { supabaseServer } from '@/lib/supabase-server';

type ExtratoItem = {
  operacao_id: string;
  tipo: 'recarga' | 'consumo' | 'taxa' | 'devolucao';
  valor: number;
  criado_em: string;
  cancelado: boolean;
  cancelado_em: string | null;
  cancelamento_tipo: 'total' | 'parcial' | null;
};

const PAGE_SIZE = 25;

export default async function ExtratoPage({
  params,
}: {
  params: Promise<{ nanoId: string }>;
}) {
  const { nanoId } = await params;

  const { data: extrato, error } = await supabaseServer.rpc(
    'fn_card_public_extrato',
    {
      p_nano_id: nanoId,
      p_limit: PAGE_SIZE,
    }
  );

  if (error) {
    return (
      <main className="app-container">
        <p className="text-muted">Erro ao carregar extrato.</p>
      </main>
    );
  }

  const items = (extrato ?? []) as ExtratoItem[];

  if (items.length === 0) {
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
        initialItems={items}
        pageSize={PAGE_SIZE}
      />
    </main>
  );
}