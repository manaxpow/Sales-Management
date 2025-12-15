
using FluentValidation;

public class InventoryValidator : AbstractValidator<UpdateQuantityRequest>
{

    public InventoryValidator()
    {
        RuleFor(x => x.Quantity)
            .GreaterThanOrEqualTo(0).WithMessage("quantity không được âm");

    }
}
