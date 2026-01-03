type ExtratoItem = {
  tipo: 'recarga' | 'consumo';
  valor: number;
  criado_em: string;
};

export default function Extrato({
  extrato,
}: {
  extrato: ExtratoItem[];
}) {
  if (extrato.length === 0) {
    return (
      <section className="text-center text-gray-400 text-sm">
        Nenhuma movimentação encontrada
      </section>
    );
  }

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold">Movimentações</h2>

      <div className="divide-y divide-gray-200">
        {extrato.map((item, index) => {
          const isRecarga = item.tipo === 'recarga';

          return (
            <div
              key={index}
              className="flex justify-between items-center py-3"
            >
              <div>
                <p className="font-medium capitalize">
                  {isRecarga ? 'Recarga' : 'Consumo'}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(item.criado_em).toLocaleString('pt-BR')}
                </p>
              </div>

              <p
                className={`font-semibold ${
                  isRecarga ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {isRecarga ? '+' : '-'} R${' '}
                {Number(item.valor).toFixed(2)}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
