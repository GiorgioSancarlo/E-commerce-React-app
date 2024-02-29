import { createContext, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

export const MyContext = createContext<{
  pay: () => void;
  addToCart: (product: ProductProps) => void;
  removeFromCart: (id: number) => void;
} | null>(null);

interface ProductProps {
  id: number;
  title: string;
  description: string;
  image: string;
  price: number;
  qty: number;

  thumbnail: string;
}

const Product: React.FC<ProductProps> = ({
  id,
  title,
  description,
  image,
  price,
  qty,

  thumbnail,
}) => {
  return (
    <div className="product">
      <img src={image} alt={thumbnail} className="product-image" />
      <div className="product-details">
        <h3 className="product-title">{title}</h3>
        <p className="product-description">{description}</p>
        <p className="product-price">Price: ${price}</p>
        <p className="product-qty">Quantity: {qty}</p>
      </div>
    </div>
  );
};

function App() {
  const [products, setProducts] = useState<Array<ProductProps>>([]);
  const [cart, setCart] = useState<
    Array<{
      product: ProductProps;
      qty: number;
    }>
  >([]);
  const [paid, setPaid] = useState<boolean>(false);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch(
          "https://mockend.up.railway.app/api/products"
        );
        const result: ProductProps[] = await response.json();
        setProducts(result.map((product) => ({ ...product, qty: 5 })));
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }

    fetchProducts();
  }, []);

  function addToCart(product: ProductProps) {
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

  const context = {
    addToCart,
    removeFromCart,
    pay,
  };
  function PageHome({ products }: { products: ProductProps[] }) {
    return (
      <div>
        {products.map((product) => (
          <div key={product.id} className="product-container">
            <Product
              id={product.id}
              title={product.title}
              description={product.description}
              image={product.image}
              price={product.price}
              qty={product.qty}
              thumbnail={product.thumbnail}
            />
            <button onClick={() => addToCart(product)}>Add to Cart</button>
          </div>
        ))}
      </div>
    );
  }

  function PageCart() {
    return <div>Cart</div>;
  }

  return (
    <MyContext.Provider value={context}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PageHome products={products} />} />
          <Route path="/Cart" element={<PageCart />} />
        </Routes>
      </BrowserRouter>
    </MyContext.Provider>
  );
}

export default App;
