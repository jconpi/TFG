import React from "react";

// Asegúrate de incluir onClearCart en las props
const ShoppingCart = ({ cart, onAddToCart, removeFromCart, onClearCart, onCloseCart }) => {
  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  return (
    <div className="shopping-cart">
      <h2>Carrito</h2>
      {cart.length > 0 ? (
        <>
          <ul>
            {cart.map((item) => (
              <li key={item.id}>
                {item.name} - Cantidad: {item.quantity}
                <button className="close-cart" onClick={onCloseCart}>×</button>
                <button onClick={() => onAddToCart(item)}>+</button>
                <button onClick={() => removeFromCart(item.id)}>Eliminar</button>
                
              </li>
            ))}
          </ul>
          <p>Total: ${total.toFixed(2)}</p> {/* Muestra el total aquí */}
          {/* Botón para limpiar el carrito, mostrado solo si hay ítems en el carrito */}
      <button className="clear-cart" onClick={onClearCart}>Limpiar Carrito</button>
        </>
      ) : (
        <p>El carrito está vacío.</p>
      )}
    </div>
  );
};

export default ShoppingCart;
