using FluentValidation;

public class PaymentValidator : AbstractValidator<Payments> {
    public PaymentValidator() {
        RuleFor(x => x.OrderId)
            .GreaterThan(0).WithMessage("OrderId must be greater than 0");

        RuleFor(x => x.Amount)
            .GreaterThan(0).WithMessage("Amount must be greater than 0");

        RuleFor(x => x.Paymentmethod)
            .NotEmpty().WithMessage("Paymentmethod is required")
            .MaximumLength(100).WithMessage("Paymentmethod must be <= 100 characters")
            .Must(BeValidMethod).WithMessage("Invalid payment method (use Cash, Card, Momo, or Bank)");

        RuleFor(x => x.PaymentDate)
            .NotEqual(default(DateTime)).WithMessage("PaymentDate is required");
    }

    private bool BeValidMethod(string method) {
        string[] valid = { "Cash", "Card", "Momo", "Bank", "Transfer" };
        return valid.Contains(method.Trim(), StringComparer.OrdinalIgnoreCase);
    }
}
