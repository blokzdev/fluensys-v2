import type { ReactNode } from "react";

type CalloutKind = "note" | "tip" | "warning" | "insight";

const KIND_STYLES: Record<CalloutKind, { border: string; label: string }> = {
  note: { border: "border-azure-bright/40", label: "Note" },
  tip: { border: "border-green-bright/40", label: "Tip" },
  warning: { border: "border-amber-400/40", label: "Caution" },
  insight: { border: "border-violet-400/40", label: "Insight" },
};

export function Callout({
  kind = "note",
  title,
  children,
}: {
  kind?: CalloutKind;
  title?: string;
  children: ReactNode;
}) {
  const style = KIND_STYLES[kind];
  return (
    <aside className={`card-surface !my-8 border-l-2 ${style.border} p-6`}>
      <p className="text-eyebrow mb-3">{title ?? style.label}</p>
      <div className="text-sm leading-relaxed text-ink-dim [&>*+*]:mt-3">{children}</div>
    </aside>
  );
}
