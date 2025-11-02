using FluentValidation;

public class ProductValidator : AbstractValidator<Products> {
    public ProductValidator() {
        RuleFor(x => x.CategoryId).GreaterThan(0).WithMessage("CategoryId must be > 0");
        RuleFor(x => x.Supplierid).GreaterThan(0).WithMessage("Supplierid must be > 0");
        RuleFor(x => x.ProductName)
            .NotEmpty().WithMessage("ProductName is required")
            .MaximumLength(200).WithMessage("ProductName must be <= 200 chars");
        RuleFor(x => x.Barcode)
            .NotEmpty().WithMessage("Barcode is required")
            .MaximumLength(100).WithMessage("Barcode must be <= 100 chars");
        RuleFor(x => x.Price).GreaterThanOrEqualTo(0).WithMessage("Price must be >= 0");
        RuleFor(x => x.Unit)
            .NotEmpty().WithMessage("Unit is required")
            .MaximumLength(50).WithMessage("Unit must be <= 50 chars");
        RuleFor(x => x.CreatedAt)
            .NotEqual(default(DateTime)).WithMessage("CreatedAt is required");
    }
}
