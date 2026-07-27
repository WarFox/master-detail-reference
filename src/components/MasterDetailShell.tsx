import { useId, type ReactNode } from 'react';

interface MasterDetailShellProps {
  /** Text for the master-list section's sr-only heading (its aria-labelledby target). */
  masterListHeading: string;
  /** Full content of the master-list column — typically a header (search/filters), a nav/list, and a footer. */
  masterList: ReactNode;
  /** Keys the detail <article>, so it resets scroll to top whenever the shown record changes. */
  detailKey: string | number;
  detail: ReactNode;
  /** Text for the context-rail's sr-only heading (its aria-labelledby target). */
  contextRailHeading: string;
  contextRail: ReactNode;
}

/**
 * The structural/semantic skeleton of a master-detail-rail view: a master-list
 * section, a detail article, and a context-rail aside, each correctly landmarked.
 * Domain-specific content (row rendering, filtering, detail fields, actions) is
 * supplied by the caller — this component only owns the shape and the ARIA wiring.
 */
export function MasterDetailShell({
  masterListHeading,
  masterList,
  detailKey,
  detail,
  contextRailHeading,
  contextRail,
}: MasterDetailShellProps) {
  const masterListHeadingId = useId();
  const contextRailHeadingId = useId();

  return (
    <div className="flex flex-1 overflow-hidden">
      <section className="flex w-96 flex-col border-r border-slate-200 bg-white" aria-labelledby={masterListHeadingId}>
        <h2 id={masterListHeadingId} className="sr-only">{masterListHeading}</h2>
        {masterList}
      </section>

      <div className="flex flex-1 overflow-hidden bg-white">
        <article key={detailKey} className="flex-1 overflow-y-auto p-8">
          {detail}
        </article>

        <aside className="w-56 border-l border-slate-200 bg-slate-50/70 p-4 space-y-6" aria-labelledby={contextRailHeadingId}>
          <h2 id={contextRailHeadingId} className="sr-only">{contextRailHeading}</h2>
          {contextRail}
        </aside>
      </div>
    </div>
  );
}
