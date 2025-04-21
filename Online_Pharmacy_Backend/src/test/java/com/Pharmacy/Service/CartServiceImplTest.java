package com.Pharmacy.Service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.ArrayList;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.Pharmacy.Repository.CartItemRepository;
import com.Pharmacy.Repository.CartRepository;
import com.Pharmacy.Request.AddCartItemRequest;
import com.Pharmacy.model.Cart;
import com.Pharmacy.model.CartItems;
import com.Pharmacy.model.Medicine;
import com.Pharmacy.model.User;

class CartServiceImplTest {

    @Mock
    private CartRepository cartRepository;

    @Mock
    private UserService userService;

    @Mock
    private CartItemRepository cartItemRepository;

    @Mock
    private MedicineService medicineService;

    @InjectMocks
    private CartServiceImpl cartService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testAddItemToCart() throws Exception {
        AddCartItemRequest req = new AddCartItemRequest();
        req.setMedicinceId(1L);
        req.setQuantity(2);
        User user = new User();
        user.setId(1L);

        Medicine medicine = new Medicine();
        medicine.setId(1L);
        medicine.setPrice(100L);

        Cart cart = new Cart();
        cart.setItem(new ArrayList<>());

        when(userService.findUserByJwtToken(anyString())).thenReturn(user);
        when(medicineService.findMedicineById(1L)).thenReturn(medicine);
        when(cartRepository.findByCustomerId(1L)).thenReturn(cart);
        when(cartItemRepository.save(any(CartItems.class))).thenAnswer(invocation -> invocation.getArgument(0));

        CartItems result = cartService.addItemToCart(req, "jwt");

        assertNotNull(result);
        assertEquals(2, result.getQuatity());
        assertEquals(200L, result.getTotalPrice());
    }

    @Test
    void testUpdateCartItemQuantity() throws Exception {
        CartItems cartItem = new CartItems();
        cartItem.setId(1L);
        cartItem.setQuatity(2);
        cartItem.setTotalPrice(200L);

        Medicine medicine = new Medicine();
        medicine.setPrice(100L);
        cartItem.setMedicine(medicine);

        when(cartItemRepository.findById(1L)).thenReturn(Optional.of(cartItem));
        when(cartItemRepository.save(any(CartItems.class))).thenAnswer(invocation -> invocation.getArgument(0));

        CartItems result = cartService.updateCartItemQuantity(1L, 5);

        assertNotNull(result);
        assertEquals(5, result.getQuatity());
        assertEquals(500L, result.getTotalPrice());
    }

    @Test
    void testRemoveItemFromCart() throws Exception {
        User user = new User();
        user.setId(1L);

        Cart cart = new Cart();
        cart.setItem(new ArrayList<>());

        CartItems cartItem = new CartItems();
        cartItem.setId(1L);
        cart.getItem().add(cartItem);

        when(userService.findUserByJwtToken(anyString())).thenReturn(user);
        when(cartRepository.findByCustomerId(1L)).thenReturn(cart);
        when(cartItemRepository.findById(1L)).thenReturn(Optional.of(cartItem));

        Cart result = cartService.removeItemFromCart(1L, "jwt");

        assertNotNull(result);
        assertTrue(result.getItem().isEmpty());
    }
}