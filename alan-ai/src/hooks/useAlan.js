import { useCallback, useContext, useEffect, useState } from 'react'
import alanBtn from '@alan-ai/alan-sdk-web';
import { useCart } from '../context/CartContext';
import storeitems from "../items.json"
import axios from 'axios'
import {addProduct} from "../context/ContextProvider."

const COMMANDS = {
  OPEN_CART: "open-cart",
  CLOSE_CART: "close-cart",
  ADD_ITEM: "add-item",
  REMOVE_ITEM: "remove-item",
  PURCHASE_ITEMS: "purchase-items"
}

export default function useAlan() {

  const [alanInstance, setAlanInstance] = useState()
  const { setShowCartItems, isCartEmpty, addToCart, removeFromCart, cart, checkout } = useCart()

  
  const [cardData, setCardData] = useState([]);
  

  //console.log(cardData)

  const sendRequest = async () => {
    const res = await axios.get("http://localhost:5000/cart/").catch((err) => console.log(err))
    const data = await res.data;
    return data;
  }

  useEffect(() => {
    sendRequest().then((data) => setCardData(data))

  }, [])




  //////////////////
  const openCart = useCallback(() => {

    if (isCartEmpty) {
      alanInstance.playText('You have no items in your cart')
    }

    alanInstance.playText("Opening the cart")
    setShowCartItems(true)

  }, [alanInstance, isCartEmpty, setShowCartItems])


  ////////////////////
  const closeCart = useCallback(() => {

    if (isCartEmpty) {
      alanInstance.playText('You have no items in your cart')
    }

    alanInstance.playText("Closing cart")
    setShowCartItems(false)

  }, [alanInstance, isCartEmpty, setShowCartItems])


  ////////////////////
  const addItem = useCallback(({ detail: { name, quantity } }) => {
    const item = storeitems.find(i => i.name.toLowerCase() === name.toLowerCase())
    if (item == null) {
      alanInstance.playText(`I cannot find the ${name} name`)
    } else {
      addToCart(item.id, quantity)
      alanInstance.playText(`Add ${quantity} of the ${name} item to your cart`)
    }
  }, [alanInstance, addToCart])

  ////////////////////
  const removeItem = useCallback(({ detail: { name } }) => {

    const entry = cart.find(e => e.item.name.toLowerCase() === name.toLowerCase())
    if (entry == null) {
      alanInstance.playText(`I cannot find the ${name} name`)
    } else {
      removeFromCart(entry.itemId)
      alanInstance.playText(`Removed of the ${name} item from cart`)
    }
  }, [alanInstance, removeFromCart, cart])

  ///////////////////
  const purchaseItems = useCallback(() => {
    if (isCartEmpty) {
      alanInstance.playText("Your cart is empty")
    } else {
      alanInstance.playText("Checking out")
      checkout()
    }
  }, [alanInstance, isCartEmpty, checkout])

  useEffect(() => {

    window.addEventListener(COMMANDS.OPEN_CART, openCart)
    window.addEventListener(COMMANDS.CLOSE_CART, closeCart)
    window.addEventListener(COMMANDS.ADD_ITEM, addItem)
    window.addEventListener(COMMANDS.REMOVE_ITEM, removeItem)
    window.addEventListener(COMMANDS.PURCHASE_ITEMS, purchaseItems)
    return () => {
      window.removeEventListener(COMMANDS.OPEN_CART, openCart)
      window.removeEventListener(COMMANDS.CLOSE_CART, closeCart)
      window.removeEventListener(COMMANDS.ADD_ITEM, addItem)
      window.removeEventListener(COMMANDS.REMOVE_ITEM, removeItem)
      window.removeEventListener(COMMANDS.PURCHASE_ITEMS, purchaseItems)
    }
  }, [openCart, closeCart, addItem, removeItem, purchaseItems])


  useEffect(() => {
    const initializeAlan = async () => {
      if (alanInstance != null) return;
  
      setAlanInstance(
        alanBtn({
          key: '94c954f70e1b2d02ec25a5ebc34ae21b2e956eca572e1d8b807a3e2338fdd0dc/stage',
          onCommand: ({ command, payload }) => {
            window.dispatchEvent(new CustomEvent(command, { detail: payload }));
          }
        })
      );
  
      // try {
      //   const data = await sendRequest();
      //   setProductData(data);
      // } catch (error) {
      //   // Handle error if needed
      // }
    };
  
    initializeAlan();
  }, []);

  return null
}
