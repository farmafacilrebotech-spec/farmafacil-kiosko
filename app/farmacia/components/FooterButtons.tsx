"use client";

interface Props {
  onPrint: () => void;
  onPayAndPrint: () => void;
}

export default function FooterButtons({ onPrint, onPayAndPrint }: Props) {
  return (
    <div
      className="w-full fixed bottom-0 left-0 z-40 py-3 flex justify-center gap-4"
      style={{
        background: "linear-gradient(135deg, #2CD4C2, #1FB4A6)",
        borderTopLeftRadius: "16px",
        borderTopRightRadius: "16px",
      }}
    >
      <button
        onClick={onPrint}
        className="bg-white text-[#17AFA4] px-4 py-2 rounded-lg font-semibold shadow-md text-sm"
      >
        Imprimir ticket
      </button>

      <button
        onClick={onPayAndPrint}
        className="bg-[#0F766E] text-white px-4 py-2 rounded-lg font-semibold shadow-md text-sm"
      >
        Pagar e imprimir
      </button>
    </div>
  );
}
