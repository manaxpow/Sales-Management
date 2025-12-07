using System.ComponentModel.DataAnnotations;

public class Promotion
{
    public Promotion() { }
    public int PromotionId { get; set; }
    public string Code { get; set; } = string.Empty;
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
