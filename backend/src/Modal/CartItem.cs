using System.ComponentModel.DataAnnotations;

public class CartItem
{
    public CartItem()
    {
    }

    [Key] public int CartItemId { get; set; }
    public int CartId { get; set; }
    public int? ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public decimal PriceSnapshot { get; set; } = 0m;
    public int Quantity { get; set; } = 1;
    public string Unit { get; set; } = "pcs";
    public decimal Subtotal { get; set; } = 0m;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public Cart? Cart { get; set; }
    public Products Product { get; set; } = null!;
}
