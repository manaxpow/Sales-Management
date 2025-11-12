
using FluentValidation;

public class InventoryValidator : AbstractValidator<UpdateQuantityRequest>
{

    public InventoryValidator()
    {
        RuleFor(x => x.Quantity)
            .NotEmpty().WithMessage("quantity không được để trống");

    }
}
