public class OrderResponse
{
    public int Id { get; set; }
    public int Customerid { get; set; }
    public int Userid { get; set; }
    public int Status { get; set; }
    public decimal TotalAmount { get; set; }
    public decimal DiscountAmount { get; set; }
    public DateTime OrderDate { get; set; }
}

public class CreateOrderResponse
{
    public int Id { get; set; }
    public int Customerid { get; set; }
    public int Userid { get; set; }
    public int Status { get; set; }
    public decimal TotalAmount { get; set; }
    public decimal DiscountAmount { get; set; }
    public string? PromotionCode { get; set; }
    public DateTime OrderDate { get; set; }
    public int? PaymentId { get; set; }

    public List<OrderItemResponse> Items { get; set; } = new();
}