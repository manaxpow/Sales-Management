namespace blazor_web.Dtos.Orders {
    public class CreateOrderWithItemsRequest {
        public int Customerid { get; set; }
        public int Userid { get; set; }
        public int Status { get; set; } = 1;
        public string? PromotionCode { get; set; }
        public int Paymentmethod { get; set; } = 1;
        public DateTime OrderDate { get; set; } = DateTime.Now;
        public List<CreateOrderItemDto> Items { get; set; } = new();
    }
}
