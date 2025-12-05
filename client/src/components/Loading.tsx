export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[50vh] sm:min-h-[60vh] md:min-h-[70vh] px-4">
      <div className="flex flex-col items-center text-center">
        <div
          role="status"
          aria-label="Cargando"
          className="relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16"
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-sky-100 to-indigo-100/60 blur-sm opacity-80" />
          <div className="relative z-10 rounded-full w-full h-full flex items-center justify-center">
            <div className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 border-4 border-t-transparent border-sky-600 rounded-full animate-spin" />
          </div>
          <span className="sr-only">Cargando</span>
        </div>

        <div className="mt-4 px-4 py-3 bg-white/60 backdrop-blur-sm rounded-lg shadow-sm">
          <p className="text-sm sm:text-base text-gray-700 font-medium">
            Cargando datos…
          </p>
        </div>
      </div>
    </div>
  )
}
