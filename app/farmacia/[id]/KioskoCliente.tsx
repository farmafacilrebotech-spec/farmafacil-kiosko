"use client";

import { useState, useMemo } from "react";
import Image from "next/image";

// Tipos
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

export default function KioskoClient({
  farmacia,
  catalogo
}: {
  farmacia: Farmacia;
  catalogo: Producto[];
}) {
  const [busqueda, setBusqueda] = useState("");
  const [categoriaActiva, setCategoriaActiva] = useState("Todas");
  const [carrito, setCarrito] = useState<Producto[]>([]);
  const [pedidoFinalizado, setPedidoFinalizado] = useState(false);

  // Categorías
  const categorias = useMemo(() => {
    const cats = catalogo.map((p) => p.categoria);
    return ["Todas", ...Array.from(new Set(cats)) as string[]];
  }, [catalogo]);

  // Filtro combinado
  const productosFiltrados = catalogo
    .filter((p) => p.nombre.toLowerCase().includes(busqueda.toLowerCase()))
    .filter(
      (p) => categoriaActiva === "Todas" || p.categoria === categoriaActiva
    );

  const agregarCarrito = (producto: Producto) => {
    setCarrito([...carrito, producto]);
  };

  const total = carrito.reduce((sum, p) => sum + p.precio, 0);

  // Simular pedido procesado
  const finalizarPedido = () => {
    setPedidoFinalizado(true);

    // Limpia carrito después de 2 segundos
    setTimeout(() => {
      setCarrito([]);
      setPedidoFinalizado(false);
    }, 2000);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto pb-32">

      {/* HEADER KIOSKO */}
      <div
        className="sticky top-0 z-50 py-6 text-center text-white"
        style={{
          background: "linear-gradient(135deg, #2CD4C2, #1FB4A6)",
        }}
      >
        <Image
          src={farmacia.logo_url}
          alt="Logo farmacia"
          width={60}
          height={60}
          className="mx-auto mb-2"
        />
        <h1 className="text-2xl font-bold">{farmacia.nombre}</h1>
      </div>

      {/* BUSCADOR */}
      <input
        type="text"
        placeholder="Buscar producto..."
        className="w-full px-4 py-2 border rounded-lg mb-4"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      {/* CATEGORÍAS */}
      <select
        className="w-full px-4 py-2 border rounded-lg mb-6"
        value={categoriaActiva}
        onChange={(e) => setCategoriaActiva(e.target.value)}
      >
        {categorias.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      {/* CATÁLOGO → 3 columnas en kiosko */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {productosFiltrados.map((producto) => (
          <div key={producto.id} className="border rounded-lg p-4 shadow-sm flex flex-col">
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
              className="mt-3 bg-[#2CD4C2] text-white py-2 rounded-md"
            >
              Añadir
            </button>
          </div>
        ))}
      </div>

      {/* BOTONERA KIOSKO */}
      {carrito.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-[0_-2px_10px_rgba(0,0,0,0.1)] flex gap-2 justify-center">

          <button
            className="flex-1 py-3 rounded-lg text-white font-bold"
            style={{ background: "#1E7F76" }}
            onClick={finalizarPedido}
          >
            Imprimir ticket
          </button>

          <button
            className="flex-1 py-3 rounded-lg text-white font-bold"
            style={{ background: "#16695E" }}
            onClick={finalizarPedido}
          >
            Pagar e imprimir
          </button>

        </div>
      )}

      {/* MENSAJE DE ÉXITO */}
      {pedidoFinalizado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <h2 className="text-xl font-bold text-green-600">¡Pedido enviado!</h2>
            <p className="mt-2">Acércate al mostrador para recoger tu compra.</p>
          </div>
        </div>
      )}

    </div>
  );
}
