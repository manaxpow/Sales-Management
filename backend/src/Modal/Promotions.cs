
using System.ComponentModel.DataAnnotations;

public class Promotions
{
    public Promotions() { }

    [Key]

    public int PromotionId { get; set; }
    public string Code { get; set; }
    public string Description { get; set; }
    public int DiscountType { get; set; }
    public decimal DiscountValue { get; set; }
    public decimal MinOrderAmount { get; set; }
    public int Usagelimit { get; set; }
    public int Usedcount { get; set; }

    public int Status { get; set; }

    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }


}
