package com.Pharmacy.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Pharmacy.Request.AddCartItemRequest;
import com.Pharmacy.Request.UpdateCartItemQuantityRequest;
import com.Pharmacy.Service.CartService;
import com.Pharmacy.Service.UserService;
import com.Pharmacy.model.Cart;
import com.Pharmacy.model.CartItems;
import com.Pharmacy.model.User;

@RestController
@RequestMapping("/api")
public class CartController {

	@Autowired
	private CartService cartService;
	
	@Autowired
	private UserService userService;
	

	    @PutMapping("/cart/add")
	    public ResponseEntity<CartItems> addItemToCart(@RequestBody AddCartItemRequest req,
	                                                  @RequestHeader("authorization") String jwt)
	            throws Exception {
	        CartItems cartItems = cartService.addItemToCart(req, jwt);
	        return new ResponseEntity<>(cartItems, HttpStatus.OK);
	    }
	    

	    @PutMapping("/cart-item/update")
	    public ResponseEntity<CartItems> updateCartItemQuantity(@RequestBody UpdateCartItemQuantityRequest req,
	                                                           @RequestHeader("authorization") String jwt)
	            throws Exception {
	        CartItems cartItems = cartService.updateCartItemQuantity(req.getCartItemId(), req.getQuantity());
	        return new ResponseEntity<>(cartItems, HttpStatus.OK);
	    }

	    @DeleteMapping("/cart-item/{id}/remove")
	    public ResponseEntity<Cart> removeCartItem(
	            @PathVariable Long id,
	            @RequestHeader("authorization") String jwt)
	            throws Exception {
	        Cart cart = cartService.removeItemFromCart(id, jwt);
	        return new ResponseEntity<>(cart, HttpStatus.OK);
	    }

	    @PutMapping("/cart/clear")
	    public ResponseEntity<Cart> clearCart(
	            @RequestHeader("authorization") String jwt)
	            throws Exception {
	    	System.out.println("Debug - JWT Token in clearCart: " + jwt);
	    	User user = userService.findUserByJwtToken(jwt);
	        Cart cart = cartService.clearCart(user.getId());
	        return new ResponseEntity<>(cart, HttpStatus.OK);
	    }

	    @GetMapping("/cart")
	    public ResponseEntity<Cart> findUserCart(
	            @RequestHeader("authorization") String jwt)
	            throws Exception {
	        User user = userService.findUserByJwtToken(jwt);
	        Cart cart = cartService.findCartByUserId(user.getId());
	        return new ResponseEntity<>(cart, HttpStatus.OK);
	    }

	 // Add this new endpoint to fetch cart items by cart ID
	    @GetMapping("/cart/{cartId}/items")
	    public ResponseEntity<List<CartItems>> getCartItems(
	            @PathVariable Long cartId,
	            @RequestHeader("authorization") String jwt)
	            throws Exception {
	        List<CartItems> cartItems = cartService.getCartItemsByCartId(cartId, jwt);
	        return new ResponseEntity<>(cartItems, HttpStatus.OK);
	    }
	    
	
}
