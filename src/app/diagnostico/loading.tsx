export default function DiagnosticoLoading() {
  return (
    <div
      className="min-h-screen pt-16"
      style={{ backgroundColor: '#0A0F1E' }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar skeleton */}
          <div className="lg:w-2/5 flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <div className="h-8 w-56 rounded-lg bg-white/5 animate-pulse" />
              <div className="h-4 w-full rounded-lg bg-white/5 animate-pulse" />
              <div className="h-4 w-4/5 rounded-lg bg-white/5 animate-pulse" />
            </div>
            <div className="flex flex-col gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-10 rounded-lg bg-white/5 animate-pulse"
                />
              ))}
            </div>
          </div>

          {/* Chat skeleton */}
          <div className="lg:w-3/5">
            <div
              className="rounded-xl border h-[600px] flex flex-col"
              style={{ borderColor: '#1E2A45', backgroundColor: '#0F1629' }}
            >
              <div className="flex-1 p-4 space-y-4">
                {[70, 50, 80, 45].map((w, i) => (
                  <div
                    key={i}
                    className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}
                  >
                    <div
                      className="h-12 rounded-xl bg-white/5 animate-pulse"
                      style={{ width: `${w}%` }}
                    />
                  </div>
                ))}
              </div>
              <div
                className="border-t p-4"
                style={{ borderColor: '#1E2A45' }}
              >
                <div className="h-10 rounded-xl bg-white/5 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
