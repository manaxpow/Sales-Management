namespace blazor_web.Dtos.Orders {
    public class CreateOrderItemDto {
        public int Productid { get; set; }
        public decimal Price { get; set; }
        public int Quantity { get; set; }
    }
}
