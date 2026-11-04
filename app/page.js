import { loadPortfolio } from "../lib/github";

// Tiene que ser un número literal. Next.js no aplica el valor si viene de un import.
export const revalidate = 300;

const oficios = [
  {
    title: "Interfaces",
    body: "Pantallas en React y Next.js, y también páginas de un solo archivo cuando el encargo cabe en el navegador.",
  },
  {
    title: "Sistemas",
    body: "APIs con Express y NestJS: ventas, inventario, servicio técnico, matrículas escolares, roles y auditoría.",
  },
  {
    title: "Datos",
    body: "PostgreSQL con Prisma, y Supabase cuando el proyecto necesita base, autenticación y archivos en el mismo taller.",
  },
];

function Manuscript({ card }) {
  return (
    <article className={card.live ? "manuscript is-live" : "manuscript"}>
      <header>
        <p className="kicker">{card.kicker}</p>
        <h3>{card.title}</h3>
      </header>
      <p>{card.body}</p>
      {card.tags.length ? (
        <ul className="tags" aria-label="Tecnologías">
          {card.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
      ) : null}
      {card.updated ? (
        <p className="meta">
          <span>{card.language}</span>
          <span className="dot" aria-hidden="true" />
          <span>
            Última marca: <time dateTime={card.updated}>{card.updatedLabel}</time>
          </span>
        </p>
      ) : null}
      <p className="actions">
        {card.visit ? (
          <a className="btn primary" href={card.visit} target="_blank" rel="noreferrer">
            Visitar
          </a>
        ) : null}
        {card.source ? (
          <a className="btn" href={card.source} target="_blank" rel="noreferrer">
            Repositorio
          </a>
        ) : null}
      </p>
    </article>
  );
}

export default async function HomePage() {
  const portfolio = await loadPortfolio();

  return (
    <>
      <a className="skip" href="#contenido">
        Saltar al contenido
      </a>
      <div className="hall">
        <article className="sheet" id="contenido">
          <header className="mast">
            <a className="brand" href="#inicio">
              <svg className="crest" viewBox="0 0 64 76" aria-hidden="true">
                <path
                  d="M32 2l26 8v22c0 18-11 28-26 38C17 60 6 50 6 32V10z"
                  fill="#6e2430"
                  stroke="#c6a15a"
                  strokeWidth="2"
                />
                <path
                  d="M32 10l16 5v14c0 11-6.6 17.4-16 23-9.4-5.6-16-12-16-23V15z"
                  fill="#3d2918"
                />
                <path
                  d="M32 22v28M24 30h16"
                  stroke="#e7d3a4"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <span>
                <strong>TiancrisENP</strong>
                <em>Casa del código</em>
              </span>
            </a>
            <nav className="nav" aria-label="Secciones">
              <a href="#oficios">Oficios</a>
              <a href="#pergaminos">Pergaminos</a>
              <a href="#fuze">Fuze</a>
              <a href="#sello">Sello</a>
            </nav>
            <a
              className="wax"
              href="https://github.com/TiancrisENP"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
          </header>

          <section className="hero" id="inicio">
            <p className="eyebrow">Crónica de los repositorios pineados</p>
            <h1>TiancrisENP</h1>
            <p className="motto">Lo que se forja con cuidado, perdura.</p>
            <p className="lede">
              Las obras fijadas en el perfil de GitHub. El orden, el lenguaje y la última marca de
              cada una se leen en vivo, para que el manuscrito no se despegue de la forja.
            </p>
            <dl className="tally">
              <div>
                <dt>Pineados</dt>
                <dd>{portfolio.manuscripts.length}</dd>
              </div>
              <div>
                <dt>Repositorios públicos</dt>
                <dd>{portfolio.publicRepos}</dd>
              </div>
              <div>
                <dt>Enlace con GitHub</dt>
                <dd>{portfolio.linkState}</dd>
              </div>
            </dl>
          </section>

          <section id="oficios" className="oficios">
            <div className="section-head">
              <h2>Oficios</h2>
              <p>El trabajo que se reconoce en esos pergaminos.</p>
            </div>
            <div className="triptych">
              {oficios.map((oficio) => (
                <article key={oficio.title}>
                  <h3>{oficio.title}</h3>
                  <p>{oficio.body}</p>
                </article>
              ))}
            </div>
          </section>

          <section id="pergaminos">
            <div className="section-head">
              <h2>Pergaminos pineados</h2>
              <p>
                El orden es el del perfil. Al pinear o soltar un repositorio, esta lista lo recoge
                sola.
              </p>
            </div>
            <div className="stack">
              {portfolio.manuscripts.map((card) => (
                <Manuscript key={card.repo} card={card} />
              ))}
            </div>
          </section>

          <section id="fuze">
            <div className="section-head">
              <h2>Obra aparte</h2>
              <p>Un encargo que no está pineado en el perfil. El trabajo aquí fue el backend de la tienda.</p>
            </div>
            <div className="stack">
              <Manuscript
                card={{
                  kicker: "Tienda de camisas · API",
                  title: "Fuze BQ",
                  body: "La tienda pública está en fuzebq.com. El backend es una API en FastAPI sobre PostgreSQL en Supabase: cuentas con JWT, catálogo con tallas y variantes, pedidos, cotización de envío por ciudad en Colombia y por país en el exterior, y cobro con Mercado Pago o PayPal. Las imágenes del catálogo quedan en Supabase Storage.",
                  tags: ["Python", "FastAPI", "PostgreSQL", "Supabase", "SQLAlchemy"],
                  visit: "https://www.fuzebq.com/",
                }}
              />
            </div>
          </section>

          <section id="sello" className="colophon">
            <svg className="seal" viewBox="0 0 120 120" aria-hidden="true">
              <circle cx="60" cy="60" r="54" fill="#7a2430" />
              <circle cx="60" cy="60" r="44" fill="none" stroke="#e7d3a4" strokeWidth="2" />
              <circle
                cx="60"
                cy="60"
                r="38"
                fill="none"
                stroke="#e7d3a4"
                strokeWidth="1"
                strokeDasharray="2 3"
              />
              <text
                x="60"
                y="68"
                textAnchor="middle"
                fill="#e7d3a4"
                fontFamily="var(--font-display), serif"
                fontSize="28"
              >
                T
              </text>
            </svg>
            <div>
              <h2>El sello</h2>
              <p>
                Todo el código público está en GitHub, bajo el nombre TiancrisENP. Los pergaminos
                de arriba son los que hoy aparecen pineados en el perfil.
              </p>
              <a
                className="btn primary"
                href="https://github.com/TiancrisENP"
                target="_blank"
                rel="noreferrer"
              >
                Abrir el perfil
              </a>
            </div>
          </section>

          <footer>
            <p>Manuscrito de TiancrisENP · Año MMXXVI</p>
          </footer>
        </article>
      </div>
    </>
  );
}
