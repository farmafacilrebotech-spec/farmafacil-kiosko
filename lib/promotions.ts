import { supabase } from "./supabase";

export async function getPromotions(farmacia_id: string) {
  const { data, error } = await supabase
    .from("promociones_farmacia")
    .select("*")
    .eq("farmacia_id", farmacia_id)
    .order("id", { ascending: false });

  if (error) {
    console.error("Error cargando promociones:", error);
    return [];
  }

  return data || [];
}
