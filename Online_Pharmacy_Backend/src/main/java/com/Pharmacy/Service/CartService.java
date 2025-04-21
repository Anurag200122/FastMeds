package com.Pharmacy.Service;

import java.util.List;

import com.Pharmacy.Request.AddCartItemRequest;
import com.Pharmacy.model.Cart;
import com.Pharmacy.model.CartItems;

public interface CartService {
	
	public CartItems addItemToCart(AddCartItemRequest req, String jwt )throws Exception;
	
	public CartItems updateCartItemQuantity(Long cartItemId, int quantity)throws Exception;
	
	public Cart removeItemFromCart(Long cartItemId, String jwt)throws Exception;
	
	public Long calculateCartTotal(Cart cart)throws Exception;
	
	public Cart findCartById(Long id)throws Exception;
	
	public Cart findCartByUserId(Long userId)throws Exception;
	
	public Cart clearCart(Long userId)throws Exception;

	List<CartItems> getCartItemsByCartId(Long cartId, String jwt) throws Exception;
	
	

}
