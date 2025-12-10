public class CartItemResponse {
    public int CartItemId { get; set; }
    public int CartId { get; set; }
    public int? ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public decimal PriceSnapshot { get; set; }
    public int Quantity { get; set; }
    public string Unit { get; set; } = "pcs";
    public decimal Subtotal { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
