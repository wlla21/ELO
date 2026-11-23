import { useState } from "react";
import symbolsData from "../backend/data/symbols.json";

interface Symbol {
  id: string;
  label: string;
  image: string;
}

const symbolsIndex: Symbol[] = symbolsData.symbols;

const symbolImages = import.meta.glob("../backend/images/EN-symbols/*.svg", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

const ITEMS_PER_PAGE = 12;

const ImageTalk = () => {
  const [selectedSymbols, setSelectedSymbols] = useState<Symbol[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(symbolsIndex.length / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  const currentSymbols = symbolsIndex.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  const toggleSymbol = (symbol: Symbol) => {
    setSelectedSymbols((previous) => {
      const alreadySelected = previous.some((item) => item.id === symbol.id);

      if (alreadySelected) {
        return previous.filter((item) => item.id !== symbol.id);
      }

      return [...previous, symbol];
    });
  };

  const sentence = selectedSymbols.map((symbol) => symbol.label).join(" ");
  const firstPageButton = Math.max(1, currentPage - 2);
  const lastPageButton = Math.min(totalPages, currentPage + 2);

  return (
    <main className="min-h-screen bg-slate-950 p-6">
      <h1 className="mb-6 text-2xl font-bold text-white">Image Talk</h1>

      {/* Sentence Builder */}
      <section className="mb-8 rounded-xl border border-slate-700 bg-slate-900 p-5">
        <h2 className="mb-3 text-lg font-semibold text-white">Your Sentence</h2>

        <p className="min-h-10 text-white">
          {sentence || "Select symbols to build your sentence..."}
        </p>

        <div className="mt-3 flex items-center justify-between">
          <span className="text-sm text-slate-400">
            {selectedSymbols.length} symbols selected
          </span>

          <button
            type="button"
            onClick={() => setSelectedSymbols([])}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
          >
            Clear
          </button>
        </div>
      </section>

      {/* Symbol Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {currentSymbols.map((symbol) => {
          const isSelected = selectedSymbols.some(
            (item) => item.id === symbol.id,
          );

          return (
            <button
              key={symbol.id}
              type="button"
              onClick={() => toggleSymbol(symbol)}
              aria-pressed={isSelected}
              className={`flex min-h-32 flex-col items-center justify-center rounded-xl border p-4 text-center transition
                ${
                  isSelected
                    ? "border-blue-400 bg-blue-900"
                    : "border-slate-700 bg-slate-900 hover:bg-slate-800"
                }`}
            >
              <img
                src={
                  symbolImages[
                    `../backend/images/EN-symbols/${symbol.image.split("/").pop()}`
                  ] ?? symbol.image
                }
                alt={symbol.label}
                className="mb-3 h-16 w-16 object-contain"
              />

              <span className="text-sm font-medium text-white">
                {symbol.label}
              </span>

              {isSelected && (
                <span className="mt-2 text-xs text-blue-300">Selected ✓</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Pagination */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
          disabled={currentPage === 1}
          className="rounded-lg border border-slate-700 px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          Previous
        </button>

        {Array.from(
          { length: lastPageButton - firstPageButton + 1 },
          (_, index) => firstPageButton + index,
        ).map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => setCurrentPage(page)}
              aria-current={currentPage === page ? "page" : undefined}
              className={`rounded-lg px-4 py-2 ${
                currentPage === page
                  ? "bg-blue-600 text-white"
                  : "border border-slate-700 text-white hover:bg-slate-800"
              }`}
            >
              {page}
            </button>
        ))}

        <button
          type="button"
          onClick={() =>
            setCurrentPage((page) => Math.min(totalPages, page + 1))
          }
          disabled={currentPage === totalPages}
          className="rounded-lg border border-slate-700 px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
        </button>
      </div>

      <p className="mt-3 text-center text-sm text-slate-400">
        Page {currentPage} of {totalPages}
        {" · "}
        Showing {startIndex + 1}–
        {Math.min(startIndex + ITEMS_PER_PAGE, symbolsIndex.length)}
        {" of "}
        {symbolsIndex.length} symbols
      </p>
    </main>
  );
};

export default ImageTalk;
