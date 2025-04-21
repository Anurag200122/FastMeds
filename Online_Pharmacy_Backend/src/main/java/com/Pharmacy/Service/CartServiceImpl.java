package com.Pharmacy.Service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.Pharmacy.Repository.CartItemRepository;
import com.Pharmacy.Repository.CartRepository;
import com.Pharmacy.Repository.MedicineRepository;
import com.Pharmacy.Request.AddCartItemRequest;
import com.Pharmacy.model.Cart;
import com.Pharmacy.model.CartItems;
import com.Pharmacy.model.Medicine;
import com.Pharmacy.model.User;


	
	@Service
	public class CartServiceImpl implements CartService {
	    
	    @Autowired
	    private CartRepository cartRepository;
	    
	    @Autowired
	    private UserService userService;
	    
	    @Autowired
	    private MedicineService medicineService;
	    
	    @Autowired
	    private CartItemRepository cartItemRepository;

	    @Override
	    public CartItems addItemToCart(AddCartItemRequest req, String jwt) throws Exception {
	        // Validate request
	        if (req == null || req.getMedicinceId() == null) {
	            throw new IllegalArgumentException("Invalid cart item request");
	        }

	        User user = userService.findUserByJwtToken(jwt);
	        Medicine medicine = medicineService.findMedicineById(req.getMedicinceId());
	        
	        if (medicine == null) {
	            throw new Exception("Medicine not found");
	        }

	        // Get or create user's cart
	        Cart cart = cartRepository.findByCustomerId(user.getId());
	        if (cart == null) {
	            cart = new Cart();
	            cart.setCustomer(user);
	            cart = cartRepository.save(cart);
	        }

	        // Check pharmacy consistency
	        if (!cart.getItem().isEmpty()) {
	            Long currentPharmacyId = cart.getItem().get(0).getMedicine().getPharmacy().getId();
	            if (!currentPharmacyId.equals(medicine.getPharmacy().getId())) {
	                throw new Exception(
	                    "Cannot mix items from different pharmacies. " +
	                    "Current items are from Pharmacy ID: " + currentPharmacyId + 
	                    ", trying to add from Pharmacy ID: " + medicine.getPharmacy().getId()
	                );
	            }
	        }

	        // Check for existing item
	        for (CartItems cartItem : cart.getItem()) {
	            if (cartItem.getMedicine().equals(medicine)) {
	                int newQuantity = cartItem.getQuatity() + req.getQuantity();
	                return updateCartItemQuantity(cartItem.getId(), newQuantity);
	            }
	        }

	        // Create new cart item
	        CartItems newCartItem = new CartItems();
	        newCartItem.setMedicine(medicine);
	        newCartItem.setCart(cart);
	        newCartItem.setQuatity(req.getQuantity());
	        newCartItem.setDossage(req.getDossage());
	        newCartItem.setTotalPrice(req.getQuantity() * medicine.getPrice());
	        
	        CartItems savedCartItem = cartItemRepository.save(newCartItem);
	        cart.getItem().add(savedCartItem);
	        
	        return savedCartItem;
	    }

	@Override
	public CartItems updateCartItemQuantity(Long cartItemId, int quantity) throws Exception {
		Optional<CartItems> cartItemOptional=cartItemRepository.findById(cartItemId);
		if(cartItemOptional.isEmpty()) {
			throw new Exception("cart item not found");
		}
		CartItems item=cartItemOptional.get();
		item.setQuatity(quantity);
		
		
		item.setTotalPrice(item.getMedicine().getPrice()*quantity);
		
		return cartItemRepository.save(item);
	}

	@Override
	public Cart removeItemFromCart(Long cartItemId, String jwt) throws Exception {
		User user=userService.findUserByJwtToken(jwt);
		
		
		Cart cart=cartRepository.findByCustomerId(user.getId());
		
		Optional<CartItems> cartItemOptional=cartItemRepository.findById(cartItemId);
		if(cartItemOptional.isEmpty()) {
			throw new Exception("cart item not found");
		}
		CartItems item=cartItemOptional.get();
		
		cart.getItem().remove(item);
		
		return cartRepository.save(cart);
		
	}

	@Override
	public Long calculateCartTotal(Cart cart) throws Exception {
		
		Long total=0L;
		
		for(CartItems cartItems:cart.getItem()) {
			total+=cartItems.getMedicine().getPrice()*cartItems.getQuatity();
		}
		return total;
	}

	@Override
	public Cart findCartById(Long id) throws Exception {
		Optional<Cart> optinalCart=cartRepository.findById(id);
		
		if(optinalCart.isEmpty()) {
			throw new Exception("cart not found with id"+id);
			
		}
		return optinalCart.get();
	}

	@Override
	public Cart findCartByUserId(Long userId) throws Exception {
		// TODO Auto-generated method stub
		Cart cart=cartRepository.findByCustomerId(userId);
		cart.setTotal(calculateCartTotal(cart));
		return cart;
	}

	@Override
	public Cart clearCart(Long userId) throws Exception {
		
		
		Cart cart=findCartByUserId(userId);
		
		cart.getItem().clear();
		
		return cartRepository.save(cart);
	}
	
	@Override
	public List<CartItems> getCartItemsByCartId(Long cartId, String jwt) throws Exception {
		
        // Validate the JWT token and fetch the user
        User user = userService.findUserByJwtToken(jwt);

        // Fetch the cart by cartId and validate ownership
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new Exception("Cart not found"));

        if (!cart.getCustomer().getId().equals(user.getId())) {
            throw new Exception("You are not authorized to access this cart");
        }

        // Fetch and return the cart items
        return cartItemRepository.findByCartId(cartId);
    }

}
