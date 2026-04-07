export default function ProjetoLoading() {
  return (
    <div className="animate-pulse">
      {/* Hero skeleton */}
      <div className="projeto-hero bg-gray-200" />

      {/* Content skeleton */}
      <section className="secao-padrao">
        <div className="container projeto-container">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-100 rounded" />
            ))}
          </div>
          <div className="space-y-3">
            <div className="h-8 bg-gray-100 rounded w-1/3" />
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-100 rounded" />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
