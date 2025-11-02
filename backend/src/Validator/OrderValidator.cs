using FluentValidation;

public class OrderValidator : AbstractValidator<Orders> {
    public OrderValidator() {
        RuleFor(x => x.Customerid)
            .GreaterThan(0).WithMessage("Customerid must be > 0");

        RuleFor(x => x.Userid)
            .GreaterThan(0).WithMessage("Userid must be > 0");

        RuleFor(x => x.Status)
            .GreaterThanOrEqualTo(0).WithMessage("Status must be >= 0");

        RuleFor(x => x.TotalAmount)
            .GreaterThanOrEqualTo(0).WithMessage("TotalAmount must be >= 0");

        RuleFor(x => x.DiscountAmount)
            .GreaterThanOrEqualTo(0).WithMessage("DiscountAmount must be >= 0")
            .LessThanOrEqualTo(x => x.TotalAmount)
            .WithMessage("DiscountAmount must be <= TotalAmount");

        RuleFor(x => x.OrderDate)
            .NotEqual(default(DateTime)).WithMessage("OrderDate is required");
    }
}
