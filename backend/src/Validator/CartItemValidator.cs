using FluentValidation;

public class CartItemValidator : AbstractValidator<CartItemRequest> {
    public CartItemValidator() {
        // Common checks
        RuleFor(x => x.ProductName)
            .NotEmpty().When(x => !x.ProductId.HasValue)
            .WithMessage("ProductName is required when ProductId is not provided");

        RuleFor(x => x.PriceSnapshot)
            .GreaterThanOrEqualTo(0).When(x => x.PriceSnapshot.HasValue)
            .WithMessage("PriceSnapshot must be >= 0");

        RuleFor(x => x.Quantity)
            .GreaterThan(0).When(x => x.Quantity.HasValue)
            .WithMessage("Quantity must be > 0");

        // Create
        RuleSet("Create", () => {
            RuleFor(x => x.CartId)
                .NotNull().WithMessage("CartId is required")
                .GreaterThan(0).WithMessage("CartId must be > 0");

            RuleFor(x => x.Quantity)
                .NotNull().WithMessage("Quantity is required")
                .GreaterThan(0).WithMessage("Quantity must be > 0");

            RuleFor(x => x.PriceSnapshot)
                .NotNull().WithMessage("PriceSnapshot is required")
                .GreaterThanOrEqualTo(0).WithMessage("PriceSnapshot must be >= 0");
        });

        // Update
        RuleSet("Update", () => {
            // on update, at least one updatable field must be provided
            RuleFor(x => x)
                .Must(x => x.ProductId.HasValue || !string.IsNullOrEmpty(x.ProductName) || x.PriceSnapshot.HasValue || x.Quantity.HasValue)
                .WithMessage("At least one field (productId/productName/priceSnapshot/quantity) must be provided for update");
        });
    }
}
