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

const ImageTalk = () => {
  const [selectedSymbols, setSelectedSymbols] = useState<Symbol[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const totalPages = Math.ceil(symbolsIndex.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;

  const currentSymbols = symbolsIndex.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  const visiblePages = () => {
    const pages: number[] = [];
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, currentPage + 2);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

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

      {/* Professional Pagination */}
      <nav
        aria-label="Symbol page navigation"
        className="mt-10 flex flex-col items-center justify-between gap-5 rounded-2xl border border-slate-700 bg-slate-900/80 p-4 shadow-lg sm:flex-row"
      >
        {/* Page Information */}
        <div className="text-sm text-slate-400">
          Showing{" "}
          <span className="font-semibold text-white">
            {symbolsIndex.length === 0 ? 0 : startIndex + 1}
          </span>
          {" - "}
          <span className="font-semibold text-white">
            {Math.min(startIndex + itemsPerPage, symbolsIndex.length)}
          </span>
          {" of "}
          <span className="font-semibold text-white">
            {symbolsIndex.length}
          </span>
          {" symbols"}
        </div>

        {/* Page Controls */}
        <ul className="flex items-center gap-1">
          {/* Previous */}
          <li>
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex h-9 items-center justify-center rounded-l-lg border border-slate-700 bg-slate-800 px-3 text-sm font-medium text-slate-300 transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-30"
            >
              Previous
            </button>
          </li>

          {/* Page Numbers */}
          {visiblePages().map((page) => (
            <li key={page}>
              <button
                type="button"
                onClick={() => setCurrentPage(page)}
                aria-current={currentPage === page ? "page" : undefined}
                className={`flex h-9 w-9 items-center justify-center border text-sm font-medium transition
            ${
              currentPage === page
                ? "border-blue-500 bg-blue-600 text-white shadow-md shadow-blue-900/30"
                : "border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
            }`}
              >
                {page}
              </button>
            </li>
          ))}

          {/* Next */}
          <li>
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="flex h-9 items-center justify-center rounded-r-lg border border-slate-700 bg-slate-800 px-3 text-sm font-medium text-slate-300 transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-30"
            >
              Next
            </button>
          </li>
        </ul>

        {/* Items Per Page */}
        <div className="flex items-center gap-3">
          <label
            htmlFor="itemsPerPage"
            className="whitespace-nowrap text-sm text-slate-400"
          >
            Show:
          </label>

          <select
            id="itemsPerPage"
            value={itemsPerPage}
            onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
            className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
          >
            <option value={10}>10 per page</option>
            <option value={25}>25 per page</option>
            <option value={50}>50 per page</option>
            <option value={100}>100 per page</option>
          </select>
        </div>
      </nav>
    </main>
  );
};

export default ImageTalk;
