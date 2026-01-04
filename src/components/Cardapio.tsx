import { formatBRL } from "@/lib/format";

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
    <section className="section">
      <h2 className="title-sm">Cardápio</h2>

      <div className="card list card-hover">
        {itens.map((item) => (
          <div key={item.id} className="list-item">
            <span>{item.nome}</span>
            <span className="text-primary">
              {formatBRL(item.preco_padrao)}
            </span>
          </div>
        ))}
      </div>
    </section>

  );
}
