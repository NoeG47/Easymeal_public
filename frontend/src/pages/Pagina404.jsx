import { Link } from "react-router-dom";
const Pagina404 = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-white px-4">
      <div className="z-10 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-800">Error 404</h1>
        <h2 className="mt-5 text-lg md:text-4xl text-gray-600">Página no encontrada</h2>
        <Link
          to="/"
          className="mt-5 inline-block bg-sage text-white text-xl px-6 py-2 rounded-md shadow-md hover:scale-120 transform transition duration-300"
        >
          Volver al inicio
        </Link>
      </div>
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Ocultas en móvil, visibles desde sm */}
        <img
          src="/images/index/queso.png"
          alt="queso"
          className="hidden sm:block absolute top-40 left-1/4 w-10 md:w-14 lg:w-16"
        />
        <img
          src="/images/index/aguacate.png"
          alt="palta"
          className="hidden sm:block absolute top-32 right-1/4 w-10 md:w-14 lg:w-16"
        />
        <img
          src="/images/index/zanahoria.png"
          alt="zanahoria"
          className="hidden sm:block absolute bottom-16 right-1/4 w-10 md:w-14 lg:w-16"
        />
        <img
          src="/images/index/naranja.png"
          alt="naranja"
          className="hidden sm:block absolute bottom-36 right-1/3 w-8 md:w-10 lg:w-12"
        />
        <img
          src="/images/index/manzana.png"
          alt="manzana"
          className="hidden sm:block absolute bottom-12 left-1/3 w-8 md:w-10 lg:w-12"
        />
        <img
          src="/images/index/carne.png"
          alt="carne"
          className="hidden sm:block absolute top-[70%] left-1/3 w-10 md:w-14 lg:w-16"
        />
        {/* Siempre visibles */}
        <img
          src="/images/index/pollo.png"
          alt="pollo"
          className="absolute top-1/3 left-1/5 w-10 md:w-14 lg:w-16"
        />
        
        <img
          src="/images/index/brocoli.png"
          alt="brócoli"
          className="absolute top-1/3 right-1/5 w-12 md:w-16 lg:w-20"
        />
      </div>
    </div>
  );
};

export default Pagina404;
