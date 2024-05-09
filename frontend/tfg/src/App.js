// src/App.js
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./Header";
import CatCarousel from "./CatCarousel";
import ShoppingCart from "./ShoppingCart";
import Footer from "./Footer";
import AdoptionForm from "./AdoptionForm";
import CoffeeList from "./CoffeeList"; // Asegúrate de haber creado este componente
import "./App.css";
import { toast, ToastContainer } from "react-toastify";

import axiosInstance from "./Axios";

import Login from "./Login";
import Register from "./Register.js";
import MyProfile from "./MyProfile.js"
import Admin from "./Admin.js"
import { AdminUsers } from "./AdminUsers.js"
import AdminCats from "./AdminCats.js"
import CatsPage from "./CatsPage.js";
import CatPage from "./CatPage.js";


function App() {
  const [cart, setCart] = useState([]);
  const [isCartVisible, setIsCartVisible] = useState(false); // Nuevo estado para visibilidad del carrito
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedLoggedIn = localStorage.getItem('isLoggedIn');
    const storedUserData = localStorage.getItem('userData');

    if (storedLoggedIn && storedLoggedIn === 'true') {
      const userData = JSON.parse(storedUserData);
      setIsLoggedIn(true);
      handleLogin(userData);

    }
  }, []);

  const handleLogin = (userData) => {
    const userDataJSON = JSON.stringify(userData);
    localStorage.setItem('userData', userDataJSON);
    localStorage.setItem('isLoggedIn', 'true'); // Guarda el estado de autenticación en localStorage
    setIsLoggedIn(true);
    setUser(userData); // Puedes guardar los datos del usuario si es necesario
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn'); 
    localStorage.removeItem('userData');

    const logOut = async () => {
      try {
          await axiosInstance.get('/logout');
          document.cookie = "session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      } catch (error) {
          console.log("Error al cerrar sesión");
      }

    }
    logOut();

    const notify = () => toast(`Hasta luego! 🐾`)
    notify(); 
    setIsLoggedIn(false);
    setUser(null); // Limpia los datos del usuario
  };

  const handleMyProfile = () => {
    if (isLoggedIn) {
      return user['id']
    }
  }

  // Función para togglear la visibilidad del carrito
  const toggleCart = () => {
    setIsCartVisible(!isCartVisible);
  };

  // Nombres y descripciones para los gatitos
  const gatitoDetails = [
    {
      name: "Gatito Juguetón",
      description:
        "Este pequeño es todo un torbellino de diversión, siempre listo para jugar.",
    },
    {
      name: "Gatito Cariñoso",
      description:
        "Un dulce compañero que busca caricias y siempre está listo para ronronear.",
    },
    {
      name: "Gatito Dormilón",
      description:
        "Amante de las siestas prolongadas, te acompañará en tardes tranquilas.",
    },
    {
      name: "Gatito Aventurero",
      description:
        "Curioso y explorador, le encanta descubrir cada rincón de su hogar.",
    },
    {
      name: "Gatito Curioso",
      description:
        "Siempre intrigado por lo desconocido, nada escapa a su atención.",
    },
    {
      name: "Gatito Perezoso",
      description:
        "El rey de la relajación, encontrará cualquier excusa para un descanso.",
    },
    {
      name: "Gatito Saltarín",
      description:
        "Energético y ágil, le encanta trepar y saltar a lugares altos.",
    },
    {
      name: "Gatito Cazador",
      description:
        "Con instintos de cazador, le fascinan los juegos que imitan la caza.",
    },
    {
      name: "Gatito Observador",
      description:
        "Prefiere mirar el mundo desde lejos, evaluando todo con sus ojos curiosos.",
    },
    {
      name: "Gatito Ronroneador",
      description:
        "Maestro del ronroneo, creará una sinfonía de vibraciones relajantes en tu regazo.",
    },
  ];

  // Genera un array de objetos de gatitos
  const cats = gatitoDetails.map((gatito, index) => ({
    id: index + 1,
    name: gatito.name,
    description: gatito.description,
  }));

  const [catsState] = useState(cats);

  const cafes = Array.from({ length: 10 }, (_, i) => ({
    id: i + 3, // Comienza los IDs en 3, según tu ejemplo original
    name: `Café ${
      [
        "Americano",
        "con leche",
        "Capuchino",
        "Latte Macchiato",
        "Mocha",
        "Espresso",
        "Vienés",
        "irlandés",
        "helado",
        "de olla",
      ][i]
    }`,
    description: `Descripción del Café ${
      [
        "Americano",
        "con leche",
        "Capuchino",
        "Latte Macchiato",
        "Mocha",
        "Espresso",
        "Vienés",
        "irlandés",
        "helado",
        "de olla",
      ][i]
    }.`,
    price: [2.5, 3, 3.5, 3.8, 4, 2, 3.2, 5, 3.5, 2.8][i],
  }));

  const carouselImages = [
    {
      url: "path-to-your-cat-image-1.jpg",
      alt: "Gatito 1",
      caption: "Gatito jugando",
    },
    {
      url: "path-to-your-cat-image-2.jpg",
      alt: "Gatito 2",
      caption: "Gatito durmiendo",
    },
    // Más imágenes aquí
  ];

  const addToCart = (itemToAdd) => {
    setCart((currentCart) => {
      // Busca el ítem en el carrito por su ID
      const itemExists = currentCart.find((item) => item.id === itemToAdd.id);
      if (itemExists) {
        // Si el ítem ya existe, incrementa su cantidad
        return currentCart.map((item) =>
          item.id === itemToAdd.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Si el ítem no existe, lo añade al carrito con cantidad inicial de 1
        return [...currentCart, { ...itemToAdd, quantity: 1 }];
      }
    });
    setIsCartVisible(true);
  };

  const removeFromCart = (itemId) => {
    setCart((currentCart) => {
      // Encuentra el ítem en el carrito
      const existingItem = currentCart.find((item) => item.id === itemId);

      if (existingItem && existingItem.quantity > 1) {
        // Si el ítem existe y su cantidad es mayor que 1, decrementa la cantidad
        return currentCart.map((item) =>
          item.id === itemId ? { ...item, quantity: item.quantity - 1 } : item
        );
      } else {
        // Si la cantidad del ítem es 1, elimina el ítem del carrito
        return currentCart.filter((item) => item.id !== itemId);
      }
    });
  };

  const clearCart = () => {
    const isConfirmed = window.confirm("¿Seguro deseas eliminar el carrito?");
    if (isConfirmed) {
      setCart([]);
    }
  };

  return (
    <Router>
      <div className="app">
        {/* Pasa toggleCart como prop a Header */}
        <Header onToggleCart={toggleCart} isLoggedIn={isLoggedIn} onLogin={handleLogin} onLogout={handleLogout} />
        <main>
          <Routes>
            <Route path="/" element={<CatCarousel images={carouselImages} />} />
            <Route
              path="/cats"
              element={<CatsPage />}
            />
            <Route path="/adoptar" element={<AdoptionForm />} />
            <Route
              path="/cafes"
              element={<CoffeeList cafes={cafes} onAddToCart={addToCart} />}
            />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/my-profile"  element={<MyProfile onMyProfile={handleMyProfile} />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/cats" element={<AdminCats />} />
            <Route path="/cat/:id" element={<CatPage />} />
          </Routes>
        </main>
        {/* Muestra condicionalmente ShoppingCart basado en isCartVisible */}
        {isCartVisible && (
          <ShoppingCart
            cart={cart}
            onAddToCart={addToCart}
            removeFromCart={removeFromCart}
            onClearCart={clearCart}
            onCloseCart={toggleCart} // Aquí pasas la función que controla la visibilidad
          />
        )}
        <Footer />
        <ToastContainer />
      </div>
    </Router>
  );
}

export default App;
