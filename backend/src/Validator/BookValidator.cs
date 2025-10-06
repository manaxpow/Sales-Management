using FluentValidation;


public class CreateBookValidator : AbstractValidator<CreateBookRequest>
{
    public CreateBookValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Title is required")
            .MaximumLength(100).WithMessage("Title cannot exceed 100 characters");

        RuleFor(x => x.Actor_id)
            .NotEmpty().WithMessage("Author is required")
            .GreaterThan(0).WithMessage("CategoryId must be greater than 0");

        
        RuleFor(x => x.Category_id)
            .NotNull().WithMessage("CategoryId is required")
            .GreaterThan(0).WithMessage("CategoryId must be greater than 0");


    }
}

