export const USER = "TiancrisENP";

/** Igual que `export const revalidate` en app/page.js. */
export const REVALIDATE_SECONDS = 300;

/** Textos propios. La lista de pergaminos sale de los pineados del perfil. */
export const notes = {
  TECHCARE: {
    kicker: "Taller y comercio",
    title: "TECHCARE",
    body: "Sistema de una tienda de computadores y su servicio técnico: ventas con descuento de stock, inventario, órdenes con código de seguimiento público, garantías, clientes, roles y auditoría. El frente está en Next.js y la API en Express, con JWT y PostgreSQL.",
    tags: ["TypeScript", "Next.js", "Express", "Prisma", "PostgreSQL"],
    visit: "https://techcare-tawny.vercel.app",
  },
  "IED-LA-VICTORIA": {
    kicker: "Diplomado · sistema escolar",
    title: "IED La Victoria",
    body: "Proyecto universitario para un colegio. NestJS concentra las reglas y el control de permisos; Supabase aporta PostgreSQL, autenticación y almacenamiento. El modelo cubre matrículas, académico, convivencia, excusas, usuarios, vínculos y auditoría.",
    tags: ["TypeScript", "NestJS", "Next.js", "Supabase"],
  },
  pokedex: {
    kicker: "Consulta viva",
    title: "Pokédex",
    body: "Buscador en React contra PokéAPI. Al escribir un nombre o un número muestra los sprites, la altura, el peso, los tipos, las estadísticas y el eslabón anterior y siguiente de la evolución.",
    tags: ["JavaScript", "React"],
    visit: "https://pokedex-beige-eta.vercel.app",
  },
  Pedida: {
    kicker: "Pieza de un solo archivo",
    title: "Pedida",
    body: "Página interactiva escrita en HTML, CSS y JavaScript. Una invitación animada, pensada para leerse bien en el teléfono y publicada en Vercel.",
    tags: ["HTML", "CSS", "JavaScript"],
    visit: "https://pedida.vercel.app",
  },
};

export const fallbackNames = Object.keys(notes);
