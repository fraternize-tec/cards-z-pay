type Item = {
  id: string;
  nome: string;
  preco_padrao: number;
};

export default function Cardapio({ itens }: { itens: Item[] }) {
  if (itens.length === 0) {
    return null;
  }

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold">Cardápio</h2>

      <div className="bg-white rounded-xl border divide-y">
        {itens.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center px-4 py-3"
          >
            <p className="font-medium">{item.nome}</p>
            <p className="font-semibold text-gray-800">
              R$ {Number(item.preco_padrao).toFixed(2)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
