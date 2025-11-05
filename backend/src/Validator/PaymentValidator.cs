using FluentValidation;

public class PaymentValidator : AbstractValidator<PaymentRequest> {
    public PaymentValidator() {
        RuleFor(x => x.OrderId)
            .GreaterThan(0).WithMessage("OrderId must be greater than 0");

        RuleFor(x => x.Amount)
            .GreaterThan(0).WithMessage("Amount must be greater than 0");

        RuleFor(x => x.Paymentmethod)
            .GreaterThan(0).WithMessage("Paymentmethod must be greater than 0");

        RuleFor(x => x.PaymentDate)
            .NotEqual(default(DateTime)).WithMessage("PaymentDate is required");
    }
}
