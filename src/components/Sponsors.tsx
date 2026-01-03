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

      <div className="grid grid-cols-3 gap-4 items-center">
        {patrocinadores.map((p, index) => {
          const content = (
            <div className="flex items-center justify-center h-16 bg-white rounded-lg border">
              {p.logo_url ? (
                <img
                  src={p.logo_url}
                  alt={p.nome}
                  className="max-h-10 object-contain"
                />
              ) : (
                <span className="text-xs text-gray-400">{p.nome}</span>
              )}
            </div>
          );

          return p.link_site ? (
            <a
              key={index}
              href={p.link_site}
              target="_blank"
              rel="noopener noreferrer"
            >
              {content}
            </a>
          ) : (
            <div key={index}>{content}</div>
          );
        })}
      </div>
    </section>
  );
}
