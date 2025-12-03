namespace blazor_web.DTOs.Promotions {
    public class PromotionResponse {
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
    public class GetPromotionResponse {
        public List<PromotionResponse> Promotions { get; set; } = new List<PromotionResponse>();
        public int TotalPromotion { get; set; }
        public int TotalPage { get; set; }
        public int CurrentPage { get; set; }

    }
}