import { createContext, ReactNode, useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../services/api';
import { Product, Stock } from '../types';

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {
    const storagedCart = localStorage.getItem('@RocketShoes:cart');

    if (storagedCart) {
      return JSON.parse(storagedCart);
    }

    return [];
  });

  // não posso fazer dessa forma pois os testes se baseiam nas validações se o metodo foi chamado, mesmo não atualizando o valor diretamente a função é chamada por causa da primeira execução
  // useEffect(() => {
  //   localStorage.setItem('@RocketShoes:cart', JSON.stringify(cart));
  // }, [cart]) 


  const addProduct = async (productId: number) => {
    try {
      const cartHasProductAlready = cart.find(cartProduct => cartProduct.id === productId);
      if (cartHasProductAlready) {
        updateProductAmount({ productId, amount: cartHasProductAlready.amount + 1 });
        return;
      }

      const { data: product } = await api.get<Product>(`/products/${productId}`);
      if (product) {
        product.amount = 1;
        setCart([...cart, product]);
        localStorage.setItem('@RocketShoes:cart', JSON.stringify([...cart, product]));
      }
    } catch {
      toast.error('Erro na adição do produto');
    }
  };

  const removeProduct = (productId: number) => {
    try {
      const product = cart.find(cartProduct => cartProduct.id === productId);
      if (product) {
        const products = cart.filter(product => product.id !== productId);
        setCart(products);
        localStorage.setItem('@RocketShoes:cart', JSON.stringify(products));
      }
      else {
        toast.error('Erro na remoção do produto');
      }
    } catch {
      toast.error('Erro na remoção do produto');
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      const product = cart.find(cartProduct => cartProduct.id === productId);

      if (product) {
        const { data: stock } = await api.get<Stock>(`stock/${productId}`)
        if (amount > stock.amount) {
          toast.error('Quantidade solicitada fora de estoque');
          return;
        }
        else if (amount <= 0) {
          toast.error('Não é possivel escolher uma quantidade menor que 1, caso deseja remover utilize a função de remoção de item do carrinho.');
          return;
        }

        product.amount = amount
        setCart([...cart]);
        localStorage.setItem('@RocketShoes:cart', JSON.stringify([...cart]));
      }
      else{
        toast.error('Erro na alteração de quantidade do produto');  
      }
    } catch {
      toast.error('Erro na alteração de quantidade do produto');
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
