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
  return (
    <main className="min-h-screen bg-slate-950 p-6">
      <h1 className="mb-6 text-2xl font-bold text-white">Image Talk</h1>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {symbolsIndex.map((symbol) => (
          <article
            key={symbol.id}
            className="flex min-h-32 flex-col items-center justify-center rounded-xl border border-slate-700 bg-slate-900 p-4 text-center"
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
            <span className="text-sm font-medium text-white">{symbol.label}</span>
          </article>
        ))}
      </div>
    </main>
  );
};

export default ImageTalk;
