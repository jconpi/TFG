import React from 'react';
import './components/CatCarousel.css';
import { Carousel } from 'react-responsive-carousel'; // Asegúrate de importar Carousel
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Importa los estilos predeterminados

const CatCarousel = ({ images }) => {
  // Asegúrate de que 'images' no sea undefined antes de intentar mapearlo.
  if (!images) {
    return <div>Loading...</div>; // O cualquier otro manejo de caso 'undefined'
  }

  return (
    <Carousel
      autoPlay
      infiniteLoop
      showThumbs={false}
      showStatus={false}
      showIndicators={false}
      showArrows={true}
      swipeable
      emulateTouch
      interval={3000} // Puedes ajustar el tiempo que cada imagen se muestra
    >
      {images.map((image, index) => (
        <div key={index}>
          <img src={image.url} alt={image.alt} />
          {/* Puedes poner una leyenda o descripción aquí si lo deseas */}
          <p className="legend">{image.caption}</p>
        </div>
      ))}
    </Carousel>
  );
};

export default CatCarousel;
