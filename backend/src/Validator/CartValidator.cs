using FluentValidation;

public class CartValidator : AbstractValidator<CartRequest> {
    public CartValidator() {
        // Common rules
        RuleFor(x => x.Status)
            .Must(s => s == null || s == "active" || s == "converted" || s == "abandoned")
            .WithMessage("Status must be one of: active, converted, abandoned");

        RuleFor(x => x.ShippingAmount)
            .GreaterThanOrEqualTo(0).When(x => x.ShippingAmount.HasValue)
            .WithMessage("ShippingAmount must be >= 0");

        RuleFor(x => x.TaxAmount)
            .GreaterThanOrEqualTo(0).When(x => x.TaxAmount.HasValue)
            .WithMessage("TaxAmount must be >= 0");

        // Create rules
        RuleSet("Create", () => {
            RuleFor(x => x.UserId)
                .NotNull().WithMessage("UserId is required")
                .GreaterThan(0).WithMessage("UserId must be > 0");
        });

        // Update rules
        RuleSet("Update", () => {
            RuleFor(x => x.UserId)
                .GreaterThan(0).When(x => x.UserId.HasValue)
                .WithMessage("If provided, UserId must be > 0");
        });
    }
}
