using System.ComponentModel.DataAnnotations;

public class Cart {
    public Cart() { }

    [Key]
    public int CartId { get; set; }
    public int UserId { get; set; }
    public int? CustomerId { get; set; }
    public int? PromoId { get; set; }
    public string? PromoCodeSnapshot { get; set; }
    public string Status { get; set; } = "active"; // "active","converted","abandoned"
    public decimal TotalAmount { get; set; } = 0m;
    public int ItemCount { get; set; } = 0;
    public decimal DiscountAmount { get; set; } = 0m;
    public decimal ShippingAmount { get; set; } = 0m;
    public decimal TaxAmount { get; set; } = 0m;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public ICollection<CartItem>? Items { get; set; }
}
