public class CartRequest {
    public int? UserId { get; set; }
    public int? CustomerId { get; set; }
    public int? PromoId { get; set; }
    public string? PromoCodeSnapshot { get; set; }
    public string? Status { get; set; } = "active";
    public decimal? ShippingAmount { get; set; }
    public decimal? TaxAmount { get; set; }
}
