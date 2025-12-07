
using System.Text.Json.Serialization;

public class PromotionResponse
{
    public int PromotionId { get; set; }
    public string PromotionCode { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int DiscountType { get; set; }
    public decimal DiscountValue { get; set; }
    public decimal MinOrderAmount { get; set; }
    public int Usagelimit { get; set; }
    public int Usedcount { get; set; }
    public int Status { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
}
public class GetPromotionResponse
{
    public List<PromotionResponse> Promotions { get; set; } = new List<PromotionResponse>();
    public int TotalPromotion { get; set; }
    public int TotalPage { get; set; }
    public int CurrentPage { get; set; }

}


public class PromotionRes
{
    [JsonPropertyName("promotionId")]
    public int Id { get; set; }

    [JsonPropertyName("promotionCode")]
    public string Code { get; set; } = string.Empty;

    [JsonPropertyName("description")]
    public string? Description { get; set; }

    [JsonPropertyName("discountType")]
    public int DiscountType { get; set; }

    [JsonPropertyName("discountValue")]
    public double DiscountValue { get; set; }

    [JsonPropertyName("minOrderAmount")]
    public double MinOrderAmount { get; set; }

    [JsonPropertyName("usagelimit")]
    public int UsageLimit { get; set; }

    [JsonPropertyName("usedcount")]
    public int Usedcount { get; set; }

    [JsonPropertyName("startDate")]
    public DateTime StartDate { get; set; }

    [JsonPropertyName("endDate")]
    public DateTime EndDate { get; set; }

    [JsonPropertyName("status")]
    public int Status { get; set; }
}

public class GetAllPromotionResponse
{
    [JsonPropertyName("promotions")]
    public List<PromotionRes> Promotions { get; set; } = new();

    [JsonPropertyName("totalCount")]
    public int TotalCount { get; set; }

    [JsonPropertyName("page")]
    public int Page { get; set; }

    [JsonPropertyName("totalPage")]
    public int TotalPages { get; set; }
    [JsonPropertyName("success")]
    public bool Success { get; set; }
}

public class GetPromotionRes
{
    [JsonPropertyName("promotions")]
    public PromotionResponse Promotion { get; set; } = new();

    [JsonPropertyName("totalCount")]
    public int TotalCount { get; set; }

    [JsonPropertyName("page")]
    public int Page { get; set; }

    [JsonPropertyName("totalPage")]
    public int TotalPages { get; set; }
    [JsonPropertyName("success")]
    public bool Success { get; set; }
}
