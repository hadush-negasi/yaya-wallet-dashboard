export default function Badge({ kind, children }) {
  const base = "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium";
  const tone = kind === "in" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700";
  const icon = kind === "in" ? "↘" : "↗";
  return <span className={`${base} ${tone}`}>{icon} {children}</span>;
}
