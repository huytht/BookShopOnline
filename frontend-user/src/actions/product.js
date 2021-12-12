
export function GetAllCategory(payload){
    return{
        type:'GET_ALL_CATEGORY',
        payload
    }
}

export function GetOrderList(payload){
    return{
        type:'GET_ORDER_LIST',
        payload
    }
}

export function GetAllProductByKeyword(payload){
    return{
        type:'GET_ALL_PRODUCT_BY_KEYWORD',
        payload
    }
}

export function GetAllProductByCategory(payload){
    return{
        type:'GET_ALL_PRODUCT_BY_CATEGORY',
        payload
    }
}

export function GetAllProduct(payload){
    return{
        type:'GET_ALL_PRODUCT',
        payload
    }
}

export function GetAllProductBest(payload){
    return{
        type:'GET_ALL_PRODUCT_BEST',
        payload
    }
}

export function GetAllProductNew(payload){
    return{
        type:'GET_ALL_PRODUCT_NEW',
        payload
    }
}
/* GET_PRODUCT_DETAIL */
export function GetProductDetail(payload){
    return{
        type:'GET_PRODUCT_DETAIL',
        payload
    }
}

/*GET NUMBER CART*/
export function GetNumberCart(){
    return{
        type:'GET_NUMBER_CART'
    }
}

export function AddCart(payload){
    return {
        type:'ADD_CART',
        payload
    }
}
export function UpdateCart(payload){
    return {
        type:'UPDATE_CART',
        payload
    }
}
export function DeleteCart(payload){
    return{
        type:'DELETE_CART',
        payload
    }
}

export function DeleteAllCart(){
    return{
        type:'DELETE_ALL_CART'
    }
}

export function IncreaseQuantity(payload){
    return{
        type:'INCREASE_QUANTITY',
        payload
    }
}
export function DecreaseQuantity(payload){
    return{
        type:'DECREASE_QUANTITY',
        payload
    }
}

