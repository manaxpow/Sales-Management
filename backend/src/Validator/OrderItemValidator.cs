using FluentValidation;

public class CreateOrderItemRequestValidator : AbstractValidator<OrderItemRequest> {
    public CreateOrderItemRequestValidator() {
        RuleFor(x => x.OrderId)
            .GreaterThan(0).WithMessage("OrderId must be greater than 0");

        RuleFor(x => x.Productid)
            .GreaterThan(0).WithMessage("Productid must be greater than 0");

        RuleFor(x => x.Quantity)
            .GreaterThan(0).WithMessage("Quantity must be greater than 0");

        RuleFor(x => x.Price)
            .GreaterThanOrEqualTo(0).WithMessage("Price must be greater than or equal to 0");
    }
}
