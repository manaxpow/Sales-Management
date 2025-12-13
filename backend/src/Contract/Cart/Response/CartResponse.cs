public class CartResponse {
    public int CartId { get; set; }
    public int UserId { get; set; }
    public int? CustomerId { get; set; }
    public int? PromoId { get; set; }
    public string? PromoCodeSnapshot { get; set; }
    public string Status { get; set; } = "active";
    public decimal TotalAmount { get; set; }
    public int ItemCount { get; set; }
    public decimal DiscountAmount { get; set; }
    public decimal ShippingAmount { get; set; }
    public decimal TaxAmount { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
