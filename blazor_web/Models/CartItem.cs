using blazor_web.Models;

namespace blazor_web.Models {
    public class CartItem {
        public Product Product { get; set; } = new();
        public int Quantity { get; set; } = 1;
        public decimal SubTotal => Product.Price * Quantity;
    }
}
