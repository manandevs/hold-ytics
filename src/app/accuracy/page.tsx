import type { Metadata } from "next";
import { Suspense } from "react";
import { getAccuracyReport } from "@/lib/polymarket/accuracy";
import { formatCurrency } from "@/lib/format";
import CalibrationChart from "@/components/accuracy/CalibrationChart";
import AccuracyOverTime from "@/components/accuracy/AccuracyOverTime";
import BrierByVolume from "@/components/accuracy/BrierByVolume";

// The study replays hundreds of upstream calls; resolved history never changes.
export const revalidate = 21600;

export const metadata: Metadata = {
  title: "How accurate are prediction markets?",
  description:
    "Brier scores and calibration measured from resolved Polymarket markets, scored against what actually happened.",
};

const SECTIONS = [
  { id: "overall", label: "Overall accuracy" },
  { id: "expected-vs-actual", label: "Expected vs Actual" },
  { id: "brier-vs-volume", label: "Brier Score vs Volume" },
  { id: "resolution", label: "Resolution Composition" },
  { id: "methods", label: "Methods" },
];

function Section({
  id,
  title,
  description,
  children,
}: {
  id: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-28 border-t border-zinc-200 pt-8 mt-8 first:border-0 first:pt-0 first:mt-0">
      <h2 className="text-lg font-bold text-zinc-900">{title}</h2>
      {description && <p className="mt-1 text-sm text-zinc-600">{description}</p>}
      <div className="mt-5 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
        {children}
      </div>
    </section>
  );
}

function ReportSkeleton() {
  return (
    <div className="space-y-6" aria-busy>
      <div className="h-24 rounded-2xl bg-white border border-zinc-200 animate-pulse" />
      <div className="h-72 rounded-2xl bg-white border border-zinc-200 animate-pulse" />
      <div className="h-96 rounded-2xl bg-white border border-zinc-200 animate-pulse" />
    </div>
  );
}

async function AccuracyReportView() {
  const report = await getAccuracyReport();

  if (!report) {
    return (
      <p className="rounded-2xl border border-zinc-200 bg-white p-8 text-center text-sm text-zinc-500 shadow-sm">
        Resolved market data is unavailable right now. Please try again shortly.
      </p>
    );
  }

  const fourHour = report.horizons.find((h) => h.id === "4h");
  const oneMonth = report.horizons.find((h) => h.id === "30d");
  const resolvedTotal = report.resolution.yes + report.resolution.no;
  const yesShare = resolvedTotal ? report.resolution.yes / resolvedTotal : 0;

  return (
    <>
      {/* Headline figures */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-px rounded-2xl border border-zinc-200 bg-zinc-200 overflow-hidden shadow-sm">
        {[
          {
            value: fourHour ? `${(fourHour.accuracy * 100).toFixed(1)}%` : "—",
            label: "4 hour accuracy",
          },
          {
            value: oneMonth ? `${(oneMonth.accuracy * 100).toFixed(1)}%` : "—",
            label: "1 month accuracy",
          },
          {
            value: fourHour ? fourHour.brier.toFixed(4) : "—",
            label: "Brier score (4 hours)",
          },
        ].map((stat) => (
          <div key={stat.label} className="bg-white px-5 py-6">
            <p className="text-3xl font-black text-zinc-900 tabular-nums">{stat.value}</p>
            <p className="mt-1 text-sm text-zinc-500">{stat.label}</p>
          </div>
        ))}
      </div>

      <Section
        id="overall"
        title="Accuracy prior to resolution"
        description="How well market prices matched the eventual outcome at different points before resolution."
      >
        <AccuracyOverTime horizons={report.horizons} />

        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-zinc-500">
                <th className="py-2 pr-4 font-bold">Before resolution</th>
                <th className="py-2 pr-4 font-bold">Markets</th>
                <th className="py-2 pr-4 font-bold">Accuracy</th>
                <th className="py-2 font-bold">Brier score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {report.horizons.map((horizon) => (
                <tr key={horizon.id}>
                  <td className="py-2 pr-4 font-semibold text-zinc-900">{horizon.label}</td>
                  <td className="py-2 pr-4 text-zinc-600 tabular-nums">
                    {horizon.sampleSize}
                  </td>
                  <td className="py-2 pr-4 text-zinc-600 tabular-nums">
                    {(horizon.accuracy * 100).toFixed(1)}%
                  </td>
                  <td className="py-2 text-zinc-600 tabular-nums">
                    {horizon.brier.toFixed(4)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section
        id="expected-vs-actual"
        title="Expected vs Actual"
        description="Grouping markets by the probability they quoted, then checking how often those markets actually resolved Yes."
      >
        <CalibrationChart
          calibration={report.calibration}
          horizons={report.horizons}
          defaultHorizon={fourHour?.id ?? report.horizons[0]?.id ?? "4h"}
        />
      </Section>

      <Section
        id="brier-vs-volume"
        title="Brier Score vs Volume"
        description="Lower is better. Brier scores show how close the price was to the truth, not just whether it picked the right side."
      >
        <BrierByVolume buckets={report.volumeBuckets} />
      </Section>

      <Section
        id="resolution"
        title="Resolution Composition"
        description="How the sampled markets actually settled."
      >
        <div className="flex flex-wrap items-center gap-6">
          <div>
            <p className="text-3xl font-black text-zinc-900 tabular-nums">
              {(yesShare * 100).toFixed(1)}%
            </p>
            <p className="text-sm text-zinc-500">resolved Yes</p>
          </div>
          <div className="flex-1 min-w-48">
            <div className="flex h-8 w-full overflow-hidden rounded-lg">
              <div
                className="flex items-center justify-center text-xs font-bold text-white"
                style={{ width: `${yesShare * 100}%`, background: "#2a78d6" }}
              >
                {yesShare > 0.12 ? `Yes ${report.resolution.yes}` : ""}
              </div>
              <div
                className="flex items-center justify-center text-xs font-bold text-white"
                style={{ width: `${(1 - yesShare) * 100}%`, background: "#eb6834" }}
              >
                {1 - yesShare > 0.12 ? `No ${report.resolution.no}` : ""}
              </div>
            </div>
            <p className="mt-2 text-xs text-zinc-500">
              {report.resolution.yes} resolved Yes · {report.resolution.no} resolved No ·{" "}
              {resolvedTotal} markets
            </p>
          </div>
        </div>
      </Section>

      <Section
        id="methods"
        title="Methods"
        description="What these numbers are, and what they are not."
      >
        <div className="space-y-4 text-sm text-zinc-600 leading-relaxed">
          <p>
            <strong className="font-semibold text-zinc-900">The sample.</strong> Resolved
            binary markets are pulled from Polymarket&apos;s API ordered by traded volume,
            filtered to those that took at least {formatCurrency(report.minVolume)} in volume
            and stayed open at least three days, then sampled at an even stride across the
            volume range so the result is not only the largest markets. That left{" "}
            <strong className="font-semibold text-zinc-900">{report.sampleSize} markets</strong>{" "}
            scored, drawn from a pool of {report.candidatePool}.
          </p>
          <p>
            <strong className="font-semibold text-zinc-900">The measurement.</strong> For each
            market we read the price of the first outcome at a set of points before it closed,
            then compare that price with what actually happened. A market is{" "}
            <em>accurate</em> at a given point if the side priced above 50% is the side that
            won.
          </p>
          <p>
            <strong className="font-semibold text-zinc-900">The Brier score</strong> is the
            mean squared error between the quoted probability and the outcome (1 or 0). Zero
            is perfect; 0.25 is what you would get by always saying 50/50. It rewards
            confidence only when that confidence is justified.
          </p>
          <p>
            <strong className="font-semibold text-zinc-900">Known limits.</strong> This is a
            sample, not the whole history of Polymarket, and it skews toward liquid markets
            that ran for a while — thin or very short-lived markets are excluded because their
            prices are mostly noise. Markets that never traded near a horizon are dropped from
            that horizon only, so the sample size differs per row. Results are recomputed
            every few hours and will move as new markets resolve.
          </p>
          <p>
            Figures describe Polymarket&apos;s historical record. They are not a forecast of
            future accuracy and are not financial advice.
          </p>
        </div>
      </Section>
    </>
  );
}

export default function AccuracyPage() {
  return (
    <main className="flex-1 bg-zinc-50 pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[180px_minmax(0,1fr)] gap-8">
        {/* Section nav */}
        <nav
          aria-label="Sections"
          className="hidden lg:block lg:sticky lg:top-24 self-start text-sm"
        >
          <ul className="space-y-2">
            {SECTIONS.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="text-zinc-500 hover:text-zinc-900 transition-colors"
                >
                  {section.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
            How accurate are prediction markets?
          </h1>
          <p className="mt-2 text-zinc-600 max-w-2xl">
            Every figure below is computed from markets that have already resolved, scored
            against what actually happened.
          </p>

          <div className="mt-8 space-y-0">
            <Suspense fallback={<ReportSkeleton />}>
              <AccuracyReportView />
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  );
}
