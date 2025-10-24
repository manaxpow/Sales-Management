
using FluentValidation;

public class CreatePromotion : AbstractValidator<CreatePromotionRequest>
{
    public CreatePromotion()
    {
        RuleFor(x => x.PromotionCode)
            .MaximumLength(50).WithMessage("Promotion code cannot exceed 50 characters");

        RuleFor(x => x.DiscountType)
            .InclusiveBetween(1, 2).WithMessage("Discount type must be either 1 (Percentage) or 2 (Fixed)");

        RuleFor(x => x.DiscountValue)
            .GreaterThan(0).WithMessage("Discount value must be greater than 0");

        RuleFor(x => x.MinOrderAmount)
            .GreaterThanOrEqualTo(0).WithMessage("Minimum order amount cannot be negative");
        RuleFor(x => x.Usagelimit)
            .GreaterThanOrEqualTo(0).WithMessage("Usage limit cannot be negative");
        RuleFor(x => x.StartDate)
            .Must(DateTimeHelper.BeValidDate)
            .WithMessage("Invalid date format. Please provide a valid date in ISO 8601 format.")
            .Must(DateTimeHelper.IsFutureDate)
            .WithMessage("Start date must be a future date");
        RuleFor(x => x.EndDate)
            .Must(DateTimeHelper.BeValidDate)
            .WithMessage("Invalid date format. Please provide a valid date in ISO 8601 format.");
        RuleFor(x => x)
        .Must(x =>
        {
            var start = DateTimeHelper.ConvertStringToDateTime(x.StartDate);
            var end = DateTimeHelper.ConvertStringToDateTime(x.EndDate);
            return start <= end;
        })
        .WithMessage("Start date must be before end date");
    }
}

public class GetPromotionValidator : AbstractValidator<GetPromotionRequest>
{
    public GetPromotionValidator()
    {
        RuleFor(x => x.DiscountType)
        .InclusiveBetween(1, 2).When(x => x.DiscountType.HasValue).WithMessage("Discount type is invalid");
        RuleFor(x => x.Limit)
            .GreaterThan(0).WithMessage("Limit must be greater than 0");

        RuleFor(x => x.Page)
            .GreaterThan(0).WithMessage("Page must be greater than 0");

        RuleFor(x => x.SortOrder)
            .Must(sortOrder => sortOrder == null || sortOrder.ToLower() == "asc" || sortOrder.ToLower() == "desc")
            .WithMessage("Sort order must be either 'asc' or 'desc'");

        RuleFor(x => x.SortBy)
            .Must(sortBy => sortBy == null || sortBy == "CreatedAt" || sortBy == "PromotionCode" || sortBy == "DiscountType")
            .WithMessage("Sort by must be one of the following: 'CreatedAt', 'PromotionCode', 'DiscountType'");
    }
}

public class UpdatePromotionValidator : AbstractValidator<UpdatePromotionRequest>
{
    public UpdatePromotionValidator()
    {
        RuleFor(x => x.PromotionId)
          .GreaterThan(0).WithMessage("Promotion Id must be greate than 0");

        RuleFor(x => x.PromotionCode)
            .MaximumLength(50)
            .When(x => !string.IsNullOrWhiteSpace(x.PromotionCode))
            .WithMessage("Promotion code cannot exceed 50 characters");

        RuleFor(x => x.DiscountType)
            .InclusiveBetween(1, 2)
            .When(x => x.DiscountType != null)
            .WithMessage("Discount type must be either 1 (Percentage) or 2 (Fixed)");

        RuleFor(x => x.DiscountValue)
            .GreaterThan(0)
            .When(x => x.DiscountValue != null)
            .WithMessage("Discount value must be greater than 0");

        RuleFor(x => x.MinOrderAmount)
            .GreaterThanOrEqualTo(0)
            .When(x => x.MinOrderAmount != null)
            .WithMessage("Minimum order amount cannot be negative");

        RuleFor(x => x.Usagelimit)
            .GreaterThanOrEqualTo(0)
            .When(x => x.Usagelimit != null)
            .WithMessage("Usage limit cannot be negative");

        RuleFor(x => x.StartDate)
            .Must(DateTimeHelper.BeValidDate!)
            .When(x => !string.IsNullOrWhiteSpace(x.StartDate))
            .WithMessage("Invalid date format. Please provide a valid date in ISO 8601 or dd/MM/yyyy format.")
            .Must(DateTimeHelper.IsFutureDate!)
            .When(x => !string.IsNullOrWhiteSpace(x.StartDate))
            .WithMessage("Start date must be a future date");

        RuleFor(x => x.EndDate)
            .Must(DateTimeHelper.BeValidDate!)
            .When(x => !string.IsNullOrWhiteSpace(x.EndDate))
            .WithMessage("Invalid date format. Please provide a valid date in ISO 8601 or dd/MM/yyyy format.");


    }
}