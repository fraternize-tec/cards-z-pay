type Sponsor = {
  nome: string;
  logo_url: string | null;
  link_site: string | null;
};

export default function Sponsors({
  patrocinadores,
}: {
  patrocinadores: Sponsor[];
}) {
  return (
    <section className="space-y-4 pt-4">
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
        Patrocinadores
      </h2>

      <div className="grid">
        {patrocinadores.map((p, i) => (
          <div key={i} className="card card-hover" style={{ textAlign: 'center' }}>
            {p.logo_url ? (
              <img src={p.logo_url} alt={p.nome} style={{ maxHeight: 40 }} />
            ) : (
              <span className="text-muted">{p.nome}</span>
            )}
          </div>
        ))}
      </div>

    </section>
  );
}
