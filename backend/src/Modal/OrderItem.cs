using System.ComponentModel.DataAnnotations;

public class OrderItem
{
    public OrderItem() { }

        [Key]

    public int OrderItemId { get; set; }
    public int OrderId { get; set; }
    public int Productid { get; set; }
    public int Quantity { get; set; }
    public decimal Price { get; set; }
    public decimal SubTotal { get; set; }
    
}