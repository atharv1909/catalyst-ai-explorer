import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Candidate } from "@/lib/mockData";
import { pickMoleculeFor } from "@/lib/molecules";
import { Copy, Box, Circle, Hexagon } from "lucide-react";

declare global {
  interface Window {
    $3Dmol?: any;
  }
}

type Style = "stick" | "sphere" | "cartoon";

export function MoleculeViewer({
  open,
  onOpenChange,
  candidate,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  candidate: Candidate | null;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<any>(null);
  const [style, setStyle] = useState<Style>("stick");
  const [ready, setReady] = useState(false);
  const [molLabel, setMolLabel] = useState<string>("");

  useEffect(() => {
    if (!open || !candidate) return;
    setReady(false);

    const t = setTimeout(() => {
      const el = containerRef.current;
      if (!el) return;
      const tryInit = (attempt = 0) => {
        if (typeof window === "undefined") return;
        if (!window.$3Dmol) {
          if (attempt > 40) return;
          setTimeout(() => tryInit(attempt + 1), 150);
          return;
        }
        try {
          el.innerHTML = "";
          const viewer = window.$3Dmol.createViewer(el, {
            backgroundColor: "#0a0f1e",
            backgroundAlpha: 1,
          });
          viewerRef.current = viewer;
          const mol = pickMoleculeFor(candidate.name, candidate.smiles || "CCO");
          setMolLabel(mol.label);
          viewer.addModel(mol.xyz, "xyz");
          applyStyle(viewer, style);
          viewer.zoomTo();
          viewer.zoom(1.2);
          viewer.rotate(20, "x");
          viewer.render();
          // Gentle auto-rotate for visual appeal
          try {
            viewer.spin("y", 0.4);
          } catch {
            /* noop */
          }
          setReady(true);
        } catch (err) {
          // Fallback: ethanol
          try {
            el.innerHTML = "";
            const viewer = window.$3Dmol.createViewer(el, {
              backgroundColor: "#0a0f1e",
              backgroundAlpha: 1,
            });
            viewerRef.current = viewer;
            const fallback = pickMoleculeFor("ethanol", "CCO");
            setMolLabel(fallback.label);
            viewer.addModel(fallback.xyz, "xyz");
            applyStyle(viewer, style);
            viewer.zoomTo();
            viewer.render();
            setReady(true);
          } catch {
            /* noop */
          }
        }
      };
      tryInit();
    }, 150);

    return () => {
      clearTimeout(t);
      try {
        viewerRef.current?.spin?.(false);
      } catch {
        /* noop */
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, candidate]);

  useEffect(() => {
    if (viewerRef.current && ready) {
      applyStyle(viewerRef.current, style);
      viewerRef.current.render();
    }
  }, [style, ready]);

  function applyStyle(v: any, s: Style) {
    v.setStyle({}, {});
    if (s === "stick")
      v.setStyle({}, { stick: { colorscheme: "cyanCarbon", radius: 0.18 } });
    if (s === "sphere")
      v.setStyle({}, { sphere: { colorscheme: "cyanCarbon", scale: 0.4 } });
    if (s === "cartoon")
      v.setStyle({}, {
        stick: { colorscheme: "cyanCarbon", radius: 0.14 },
        sphere: { colorscheme: "cyanCarbon", scale: 0.28 },
      });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[96vw] md:max-w-6xl h-[92vh] p-0 panel border-cyan/40 overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b border-border">
          <DialogTitle className="font-mono text-base flex items-center gap-3">
            <Box className="h-4 w-4 text-cyan" />
            3D Molecular Viewer
            <span className="text-xs text-muted-foreground font-normal">
              · {candidate?.name}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] h-[calc(92vh-65px)]">
          <div className="relative bg-gradient-to-br from-background to-card overflow-hidden">
            <div
              ref={containerRef}
              className="absolute inset-0"
              style={{ position: "absolute" }}
            />
            {!ready && (
              <div className="absolute inset-0 flex items-center justify-center text-xs font-mono text-muted-foreground">
                Initializing 3Dmol viewer…
              </div>
            )}
            <div className="absolute top-3 left-3 flex gap-1.5 panel rounded-md p-1">
              {(["stick", "sphere", "cartoon"] as Style[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setStyle(s)}
                  className={`px-2.5 py-1 rounded text-[10px] font-mono uppercase tracking-wider transition ${
                    style === s
                      ? "bg-cyan/20 text-cyan border border-cyan/50"
                      : "text-muted-foreground hover:bg-muted border border-transparent"
                  }`}
                >
                  {s === "stick" && <Hexagon className="h-3 w-3 inline mr-1" />}
                  {s === "sphere" && <Circle className="h-3 w-3 inline mr-1" />}
                  {s === "cartoon" && <Box className="h-3 w-3 inline mr-1" />}
                  {s}
                </button>
              ))}
            </div>
            <div className="absolute bottom-3 left-3 right-3 panel rounded-md p-2.5 text-[11px] font-mono text-muted-foreground flex flex-wrap gap-2 justify-between">
              <span>Drag to rotate · Scroll to zoom · Shift+drag to pan</span>
              <span className="text-cyan">Rendered: {molLabel || "—"}</span>
            </div>
          </div>

          <aside className="border-l border-border p-5 overflow-y-auto scrollbar-thin">
            <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
              Candidate
            </div>
            <div className="font-mono text-sm font-semibold mt-1">{candidate?.name}</div>

            <div className="mt-4 flex items-center gap-2">
              <code className="flex-1 truncate font-mono text-xs bg-muted/50 px-2 py-1.5 rounded border border-border">
                {candidate?.smiles}
              </code>
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7"
                onClick={() => candidate && navigator.clipboard?.writeText(candidate.smiles)}
              >
                <Copy className="h-3.5 w-3.5" />
              </Button>
            </div>

            <div className="mt-6 space-y-3">
              {candidate &&
                [
                  { l: "Activity", v: candidate.activity },
                  { l: "Selectivity", v: candidate.selectivity },
                  { l: "Stability", v: candidate.stability },
                ].map((p) => (
                  <div key={p.l}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground font-mono uppercase tracking-wider text-[10px]">
                        {p.l}
                      </span>
                      <span className="font-mono text-cyan">{p.v.toFixed(3)}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan to-[color:var(--purple-tag)]"
                        style={{ width: `${p.v * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              {candidate && (
                <div className="pt-2 border-t border-border text-xs font-mono text-muted-foreground">
                  Uncertainty: <span className="text-foreground">±{candidate.uncertainty}</span>
                  <br />
                  Source: <span className="text-foreground">{candidate.source}</span>
                  <br />
                  Rank: <span className="text-foreground">#{candidate.rank} of 31</span>
                </div>
              )}
            </div>
          </aside>
        </div>
      </DialogContent>
    </Dialog>
  );
}
