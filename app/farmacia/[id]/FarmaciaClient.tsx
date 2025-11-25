"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

// -----------------------------
// Tipos
// -----------------------------
interface Producto {
  id: string;
  nombre: string;
  precio: number;
  stock: number;
  categoria: string;
  imagen: string;
}

interface Farmacia {
  farmacia_id: string;
  nombre: string;
  logo_url: string;
  direccion: string;
  telefono: string;
  horario: string;
  color_principal: string;
}

// -----------------------------
// COMPONENTE PRINCIPAL
// -----------------------------
export default function FarmaciaClient({
  farmacia,
  catalogo
}: {
  farmacia: Farmacia;
  catalogo: Producto[];
}) {

  const searchParams = useSearchParams();
  const esKiosko = searchParams.get("kiosk") === "1";

  const [busqueda, setBusqueda] = useState("");
  const [categoriaActiva, setCategoriaActiva] = useState("Todas");
  const [carrito, setCarrito] = useState<Producto[]>([]);
  const [pedidoEnviado, setPedidoEnviado] = useState(false);

  // -----------------------------
  // Categorías dinámicas
  // -----------------------------
  const categorias = useMemo(() => {
    const cats = catalogo.map((p) => p.categoria);
    return ["Todas", ...Array.from(new Set(cats)) as string[]];
  }, [catalogo]);

  // -----------------------------
  // Filtro combinado
  // -----------------------------
  const productosFiltrados = catalogo
    .filter((p) =>
      p.nombre.toLowerCase().includes(busqueda.toLowerCase())
    )
    .filter(
      (p) =>
        categoriaActiva === "Todas" || p.categoria === categoriaActiva
    );

  const agregarCarrito = (producto: Producto) => {
    setCarrito([...carrito, producto]);
  };

  const total = carrito.reduce((sum, p) => sum + p.precio, 0);

  const enviarPedido = () => {
    setPedidoEnviado(true);
  };

  // -----------------------------
  // Pantalla de éxito
  // -----------------------------
  if (pedidoEnviado) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold text-green-600 mb-4">
          ¡Pedido enviado!
        </h1>
        <p className="mb-6">Tu pedido ha sido enviado al mostrador.</p>
        <p className="text-sm text-gray-500">Nº pedido: DEMO-1275</p>

        <button
          className="mt-8 px-6 py-3 bg-[#1E7F76] text-white rounded-lg"
          onClick={() => setPedidoEnviado(false)}
        >
          Hacer otro pedido
        </button>
      </div>
    );
  }

  // -----------------------------
  // RENDER PRINCIPAL
  // -----------------------------
  return (
    <div className="p-4 max-w-5xl mx-auto pb-40">

      {/* -------------------------------------- */}
      {/* CABECERA PREMIUM                       */}
      {/* -------------------------------------- */}
      <div
        className="sticky top-0 z-[999] text-center shadow-md"
        style={{
          background: "linear-gradient(135deg, #2CD4C2, #1FB4A6)",
          color: "white",
          paddingTop: "24px",
          paddingBottom: "28px"
        }}
      >
        <Image
          src={farmacia.logo_url}
          alt="Logo farmacia"
          width={70}
          height={70}
          className="mx-auto mb-2 drop-shadow-lg"
        />

        <h1 className="text-3xl font-bold drop-shadow-md">
          {farmacia.nombre}
        </h1>

        <p className="drop-shadow-md">{farmacia.direccion}</p>
        <p className="drop-shadow-md">{farmacia.horario}</p>
      </div>

      {/* SEPARACIÓN tras cabecera */}
      <div className="mt-4"></div>

      {/* -------------------------------------- */}
      {/* BUSCADOR                                */}
      {/* -------------------------------------- */}
      <input
        type="text"
        placeholder="Buscar producto..."
        className="w-full px-4 py-2 border rounded-lg mb-4 shadow-sm"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      {/* -------------------------------------- */}
      {/* CATEGORÍAS                              */}
      {/* -------------------------------------- */}
      <select
        className="w-full px-4 py-2 border rounded-lg mb-6 shadow-sm"
        value={categoriaActiva}
        onChange={(e) => setCategoriaActiva(e.target.value)}
      >
        {categorias.map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>

      {/* -------------------------------------- */}
      {/* CATÁLOGO                                */}
      {/* -------------------------------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-4">
        {productosFiltrados.map((producto) => (
          <div
            key={producto.id}
            className="border rounded-lg p-4 shadow-sm flex flex-col bg-white"
          >
            <Image
              src={producto.imagen}
              alt={producto.nombre}
              width={200}
              height={200}
              className="mx-auto mb-3"
            />

            <h3 className="font-semibold">{producto.nombre}</h3>
            <p className="text-sm text-gray-500">{producto.categoria}</p>
            <p className="font-bold mt-2">{producto.precio.toFixed(2)} €</p>

            <button
              onClick={() => agregarCarrito(producto)}
              className="mt-3 bg-[#2CD4C2] text-white py-2 rounded-md shadow"
            >
              Añadir
            </button>

            {/* RECOMENDADOS */}
            <div className="mt-4">
              {catalogo
                .filter(
                  (r) =>
                    r.categoria === producto.categoria &&
                    r.id !== producto.id
                )
                .slice(0, 2).length > 0 && (
                  <div>
                    <h4 className="font-semibold text-sm mb-2">
                      Te puede interesar:
                    </h4>

                    <div className="grid grid-cols-2 gap-2">
                      {catalogo
                        .filter(
                          (r) =>
                            r.categoria === producto.categoria &&
                            r.id !== producto.id
                        )
                        .slice(0, 2)
                        .map((r) => (
                          <button
                            key={r.id}
                            className="border p-2 rounded text-xs"
                            onClick={() => agregarCarrito(r)}
                          >
                            {r.nombre}
                          </button>
                        ))}
                    </div>

                  </div>
                )}
            </div>

          </div>
        ))}
      </div>

      {/* -------------------------------------- */}
      {/* CARRITO                                 */}
      {/* -------------------------------------- */}
      <div className="mt-10 p-4 border rounded-lg shadow-md bg-white">
        <h2 className="text-xl font-semibold mb-3">Carrito</h2>

        {carrito.length === 0 ? (
          <p className="text-gray-500">Tu carrito está vacío.</p>
        ) : (
          <>
            <ul>
              {carrito.map((p, i) => (
                <li key={i} className="flex justify-between py-1 text-sm">
                  <span>{p.nombre}</span>
                  <span>{p.precio.toFixed(2)} €</span>
                </li>
              ))}
            </ul>

            <hr className="my-3" />

            <p className="font-bold text-lg">
              Total: {total.toFixed(2)} €
            </p>

            <button
              onClick={enviarPedido}
              className="mt-4 w-full bg-[#1E7F76] text-white py-3 rounded-md shadow"
            >
              Enviar pedido al mostrador
            </button>
          </>
        )}
      </div>

      {/* -------------------------------------- */}
      {/* PIE FARMAFÁCIL                          */}
      {/* -------------------------------------- */}
      <footer className="text-center text-sm text-gray-500 mt-10">
        <img
          src="/logo_farmafacil.png"
          alt="FarmaFácil"
          className="w-24 mx-auto mb-2 opacity-60"
        />
        FarmaFácil – by ReBoTech Solutions
      </footer>

      {/* -------------------------------------- */}
      {/* ESPACIADOR PARA QUE NO SE TAPE CONTENIDO*/}
      {/* -------------------------------------- */}
      <div className="pb-40"></div>

      {/* -------------------------------------- */}
      {/* MODO KIOSKO                             */}
      {/* -------------------------------------- */}
      {esKiosko && (
        <div
          className="fixed bottom-0 left-0 right-0 z-[9999] px-4 py-3
                     flex gap-3 justify-center bg-[#1FB4A6] shadow-xl"
        >
          <button className="bg-[#2CD4C2] text-white px-4 py-3 rounded-lg font-bold w-full max-w-xs shadow">
            Imprimir ticket
          </button>

          <button className="bg-[#11998e] text-white px-4 py-3 rounded-lg font-bold w-full max-w-xs shadow">
            Pagar e imprimir
          </button>

          <button className="bg-[#0f766e] text-white px-4 py-3 rounded-lg font-bold w-full max-w-xs shadow">
            Guardar pedido
          </button>
        </div>
      )}

    </div>
  );
}
