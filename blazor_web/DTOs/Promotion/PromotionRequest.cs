using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc.Filters;

public class GetAllPromotionReq
{
    public int Page { get; set; }
    public int Limit { get; set; }
    public string? PromotionCode { get; set; } = string.Empty;
    public int? Status { get; set; }


}


public class GetPromotionByIdReq
{
    int Id { get; set; }
}

public class CreatePromotionModal
{
    [Required(ErrorMessage = "Promotion code is not empty")]
    [MinLength(5, ErrorMessage = "Promotion code must have 5 character")]
    [MaxLength(20, ErrorMessage = "Promotion code too long")]
    public string PromotionCode { get; set; } = string.Empty;

    [MaxLength(200, ErrorMessage = "Description too long")]
    public string? Description { get; set; }

    [Required]
    [Range(1, 2, ErrorMessage = "Invalid Discount Type")]
    public DiscountTypeEnum DiscountType { get; set; }

    [Required]
    [Range(1, double.MaxValue, ErrorMessage = "Value must be non-negative and greater than zero")]
    public double DiscountValue { get; set; }

    [Range(1, double.MaxValue, ErrorMessage = "Value must be non-negative and greater than zero")]
    public double MinOrderAmount { get; set; }

    [Range(0, int.MaxValue, ErrorMessage = "Value must be non-negative")]
    public int UsageLimit { get; set; }

    [Required]
    [DataType(DataType.Date)]
    public DateOnly StartDate { get; set; } = DateOnly.FromDateTime(DateTime.Today);

    [Required]
    [DataType(DataType.Date)]
    public DateOnly EndDate { get; set; } = DateOnly.FromDateTime(DateTime.Today);
}
public class EditPromotionModal
{
    [Required]
    public int Id { get; set; }
    [Required(ErrorMessage = "Promotion code is not empty")]
    [MinLength(5, ErrorMessage = "Promotion code must have 5 character")]
    [MaxLength(20, ErrorMessage = "Promotion code too long")]
    public string PromotionCode { get; set; } = string.Empty;

    [MaxLength(200, ErrorMessage = "Description too long")]
    public string? Description { get; set; }

    [Required]
    [Range(1, 2, ErrorMessage = "Invalid Discount Type")]
    public DiscountTypeEnum DiscountType { get; set; }

    [Required]
    [Range(1, double.MaxValue, ErrorMessage = "Value must be non-negative and greater than zero")]
    public double DiscountValue { get; set; }

    [Range(1, double.MaxValue, ErrorMessage = "Value must be non-negative and greater than zero")]
    public double MinOrderAmount { get; set; }

    [Range(0, int.MaxValue, ErrorMessage = "Value must be non-negative")]
    public int UsageLimit { get; set; }

    [Required]
    [DataType(DataType.Date)]
    public DateOnly StartDate { get; set; } = DateOnly.FromDateTime(DateTime.Today);

    [Required]
    [DataType(DataType.Date)]
    public DateOnly EndDate { get; set; } = DateOnly.FromDateTime(DateTime.Today);

    public StatusTypeEnum Status { get; set; }
}
public class CreatePromotionReq
{
    public string PromotionCode { get; set; } = "";
    public string? Description { get; set; }
    public int DiscountType { get; set; }
    public double DiscountValue { get; set; }
    public double MinOrderAmount { get; set; }
    public int UsageLimit { get; set; }
    public string StartDate { get; set; } = string.Empty;
    public string EndDate { get; set; } = string.Empty;
}

public class UpdatePromotionReq
{
    public int Id { get; set; }
    public string PromotionCode { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int DiscountType { get; set; } = 1;
    public double DiscountValue { get; set; }
    public double MinOrderAmount { get; set; }
    public int UsageLimit { get; set; }
    public string StartDate { get; set; } = string.Empty;
    public string EndDate { get; set; } = string.Empty;
    public int Status { get; set; }
}

public class DeletePromotionReq
{
    [Required]
    public int Id { get; set; }
}
public enum DiscountTypeEnum
{
    Percent = 1,
    Amount = 2
}

public enum StatusTypeEnum
{
    Active = 1,
    Inactive = 0,
    Experied = 3
}