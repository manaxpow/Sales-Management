public class OrderRequest
{
    public int Customerid { get; set; }
    public int Userid { get; set; }
    public int Status { get; set; }
    public decimal TotalAmount { get; set; }
    public decimal DiscountAmount { get; set; }
    public DateTime OrderDate { get; set; }
}

public class CreateOrderWithItemsRequest
{
    public int Customerid { get; set; }
    public int Userid { get; set; }
    public int Status { get; set; } = 1;
    public string? PromotionCode { get; set; }
    public int Paymentmethod { get; set; } = 1;
    public List<CreateOrderItemDto> Items { get; set; } = new();
}