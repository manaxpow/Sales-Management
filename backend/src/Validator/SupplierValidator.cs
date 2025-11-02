using FluentValidation;

public class SupplierValidator : AbstractValidator<Suppliers> {
    public SupplierValidator() {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Name is required")
            .MaximumLength(200).WithMessage("Name must be <= 200 chars");

        RuleFor(x => x.Phone)
            .NotEmpty().WithMessage("Phone is required")
            // mẫu đơn giản VN: 10 chữ số, có thể thay đổi theo nhu cầu
            .Matches(@"^\d{9,11}$").WithMessage("Phone must be 9-11 digits");

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required")
            .EmailAddress().WithMessage("Email is invalid")
            .MaximumLength(200).WithMessage("Email must be <= 200 chars");

        RuleFor(x => x.Address)
            .NotEmpty().WithMessage("Address is required")
            .MaximumLength(300).WithMessage("Address must be <= 300 chars");

        RuleFor(x => x.CreatedAt)
            .NotEqual(default(DateTime)).WithMessage("CreatedAt is required");

        RuleFor(x => x.UpdatedAt)
            .NotEqual(default(DateTime)).WithMessage("UpdatedAt is required")
            .GreaterThanOrEqualTo(x => x.CreatedAt)
            .WithMessage("UpdatedAt must be >= CreatedAt");
    }
}
