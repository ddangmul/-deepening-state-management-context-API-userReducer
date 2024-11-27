import { createContext } from "react";

export const CartContext = createContext({
  items: [],
  addItemToCart: () => {},
  updateCartItemQuantity: () => {},
});
// 컨테스트 함수로 만든 값은 리액트 컴포넌트가 들어있는 객체이다.
// 인수에 초기값을 넣고, 해당 값을 리액트에서 사용하는 모든 컴포넌트에게 전달할 수 있다.
// 초기값은 어떠한 값도 올 수 있다.
