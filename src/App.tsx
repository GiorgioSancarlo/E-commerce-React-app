import { useState } from "react";

interface Product {
  qty: number;
  userId: number;
  title: string;
  description: string;
  id: number;
  price: number;
  image: string;
  thumbnail: string;
}
function App() {
  const [products, setProducts] = useState<Array<Product>>([]);
  const [cart, setCart] = useState<
    Array<{
      product: Product;
      qty: number;
    }>
  >([]);
  const [paid, setPaid] = useState<boolean>(false);

  function addToCart(product: Product) {
    const productFound = cart.find(
      (productCart) => productCart.product.id === product.id
    );
    if (!!productFound) {
      const newCart = cart.map((productCart) =>
        productCart.product.id === product.id
          ? { product: productCart.product, qty: productCart.qty + 1 }
          : { ...productCart }
      );
      setCart(newCart);
    } else setCart([...cart, { product, qty: 1 }]);
  }

  function removeFromCart(id: number) {
    const productFound = cart.find(
      (productCart) => productCart.product.id === id
    );
    if (productFound && productFound.qty > 1) {
      const newCart = cart.map((productCart) =>
        productCart.product.id === id
          ? { product: productCart.product, qty: productCart.qty - 1 }
          : { ...productCart }
      );
      setCart(newCart);
    } else {
      const newCart = cart.filter(
        (productCart) => productCart.product.id !== id
      );
      setCart(newCart);
    }
  }

  function pay() {
    setPaid(true);
    setCart([]);
  }

  return <h1>Hello</h1>;
}

export default App;
