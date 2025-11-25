// ESTE ARCHIVO ES SERVER COMPONENT

import fs from "fs/promises";
import path from "path";
import FarmaciaClient from "./FarmaciaClient";

export function generateStaticParams() {
  return [{ id: "F012-DEMO" }];
}

export default async function Page({ params }: { params: { id: string } }) {
  // Rutas a los JSON en /public/demo
  const farmaciaPath = path.join(process.cwd(), "public", "demo", "farmacia.json");
  const catalogoPath = path.join(process.cwd(), "public", "demo", "catalogo.json");

  // Leer archivos
  const farmacia = JSON.parse(await fs.readFile(farmaciaPath, "utf-8"));
  const catalogo = JSON.parse(await fs.readFile(catalogoPath, "utf-8"));

  return (
    <div>
      {/* SEO oculto */}
      <h1 className="hidden">Farmacia {params.id}</h1>

      {/* Cargamos componente cliente */}
      <FarmaciaClient farmacia={farmacia} catalogo={catalogo} />
    </div>
  );
}
