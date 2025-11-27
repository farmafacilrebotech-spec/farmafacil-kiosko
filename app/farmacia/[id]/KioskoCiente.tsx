"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { Product } from "@/lib/types";

export default function KioskoCliente() {
  const { id } = useParams();
  const [productos, setProductos] = useState<Product[]>([]);
  const [carrito, setCarrito] = useState<Product[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [categoriaActiva, setCategoriaActiva] = useState("Todas");

  // ===========================
  // CARGAR PRODUCTOS
  // ===========================
  useEffect(() => {
    async function loadProductos() {
      const { data, error } = await supabase
        .from("productos")
        .select("*")
        .eq("farmacia_id", id);

      if (!error && data) {
        setProductos(data as Product[]);
      }
    }

    loadProductos();
  }, [id]);

  // ===========================
  // AÑADIR AL CARRITO
  // ===========================
    function addToCart(producto: Product) {
    setCarrito((c) => [...c, producto]);
  }

  // ===========================
  // FILTROS
  // ===========================
  const productosFiltrados = productos.filter((p) =>
        p.name.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="min-h-screen pb-32 bg-white">
      {/* HEADER KIOSKO */}
      <header className="px-4 py-3 bg-[#1FB4A6] text-white font-bold text-xl shadow">
        Kiosko FarmaFácil
      </header>

      {/* BUSCADOR */}
      <div className="p-4">
        <input
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar producto..."
          className="w-full p-3 border rounded-lg"
        />
      </div>

      {/* LISTA DE PRODUCTOS */}
      <div className="grid grid-cols-3 gap-3 px-4">
        {productosFiltrados.map((producto) => (
          <div
            key={producto.id}
            className="border rounded-lg p-3 shadow cursor-pointer hover:bg-gray-100"
            onClick={() => addToCart(producto)}
          >
            <p className="font-semibold">{producto.name}</p>
            <p className="text-[#1FB4A6] font-bold">{producto.price} €</p>
          </div>
        ))}
      </div>

      {/* FOOTER KIOSKO */}
      <div
        className="
          fixed bottom-0 left-0 right-0 
          px-4 py-3 flex gap-3 justify-center 
          bg-[#1FB4A6] shadow-xl
        "
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
    </div>
  );
}
