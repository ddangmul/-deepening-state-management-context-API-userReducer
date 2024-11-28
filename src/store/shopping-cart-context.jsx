import { createContext, useReducer } from "react"; //상태 구문을 사용하지 않으므로 useState 훅 삭제 가능

import { DUMMY_PRODUCTS } from "../dummy-products";

// 컨텍스트 생성 - 자동완성 기능을 위해 속성에 초기값 추가
export const CartContext = createContext({
  items: [],
  addItemToCart: () => {},
  updateCartItemQuantity: () => {},
});
// 컨테스트 함수로 만든 값은 리액트 컴포넌트가 들어있는 객체이다.
// 인수에 초기값을 넣고, 해당 값을 리액트에서 사용하는 모든 컴포넌트에게 전달할 수 있다.
// 초기값은 어떠한 값도 올 수 있다.

// Reducer 함수
function shoppingCartReducer(state, action) {
  // 각각 핸들러에서 실행한 dispatch함수에서 지정한 action 값에 따라
  // if문 사용해 상태 업데이트 구문 작성
  if (action.type === "ADD_ITEM") {
    const updatedItems = [...state.items];

    const existingCartItemIndex = updatedItems.findIndex(
      (cartItem) => cartItem.id === action.payload
    );
    const existingCartItem = updatedItems[existingCartItemIndex];

    if (existingCartItem) {
      const updatedItem = {
        ...existingCartItem,
        quantity: existingCartItem.quantity + 1,
      };
      updatedItems[existingCartItemIndex] = updatedItem;
    } else {
      const product = DUMMY_PRODUCTS.find(
        (product) => product.id === action.payload
      );
      updatedItems.push({
        id: product.id,
        name: product.title,
        price: product.price,
        quantity: 1,
      });
    }

    return {
      // 상태에 하나의 값만 있기 때문에 전개연산자 사용하지 않았음
      items: updatedItems,
    };
  }

  if (action.type === "UPDATE_ITEM") {
    const updatedItems = [...state.items];
    const updatedItemIndex = updatedItems.findIndex(
      (item) => item.id === action.payload.productId
    );

    const updatedItem = {
      ...updatedItems[updatedItemIndex],
    };

    updatedItem.quantity += action.payload.amount;

    if (updatedItem.quantity <= 0) {
      updatedItems.splice(updatedItemIndex, 1);
    } else {
      updatedItems[updatedItemIndex] = updatedItem;
    }

    return {
      ...state,
      items: updatedItems,
    };
  }
  return state;
}

// 컨텍스트 제공 컴포넌트
export default function CartContextProvider({ children }) {
  // useReducer 실행 - 초기값을 가진 새 상태값 생성
  const [shoppingCartState, shoppingCartDispatch] = useReducer(
    shoppingCartReducer,
    {
      items: [],
    }
  );

  // 기존 useState 구문 - useReducer 사용함으로서 필요 없어짐
  // const [shoppingCart, setShoppingCart] = useState({
  //   items: [],
  // });

  // AddItem 핸들러 함수
  function handleAddItemToCart(id) {
    // 디스패치 함수 (Reducer로 액션 전달)
    shoppingCartDispatch({
      type: "ADD_ITEM",
      payload: id,
    });
  }

  // UpdateItemQuantity 핸들러 함수
  function handleUpdateCartItemQuantity(productId, amount) {
    // 디스패치 함수 (Reducer로 액션 전달)
    shoppingCartDispatch({
      type: "UPDATE_ITEM",
      payload: {
        productId, // js 기능: 객체 속성명이 값을 가진 변수와 같다면 이렇게 작성 가능
        amount,
      },
    });
  }

  // 컴포넌트간 공유할 컨텍스트 값
  const ctxValue = {
    items: shoppingCartState.items,
    addItemToCart: handleAddItemToCart,
    updateCartItemQuantity: handleUpdateCartItemQuantity,
  };

  return (
    <CartContext.Provider value={ctxValue}>{children}</CartContext.Provider>
  );
}
// useReducer 순기능
// : 상태 관리 구문이 Provider 컴포넌트 내 set함수가 아닌,
// : Provider 컴포넌트 밖 reducer함수 내에서 이뤄지고 있다. ==> 컨텍스트 컴포넌트 간소화
