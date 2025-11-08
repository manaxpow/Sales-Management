public class OrderItemRequest
{
    public int OrderId { get; set; }
    public int Productid { get; set; }
    public int Quantity { get; set; }
    public decimal Price { get; set; }
}

public class CreateOrderItemDto
{
    public int Productid { get; set; }
    public int Quantity { get; set; }
    public decimal Price { get; set; }
}