using FluentValidation;


public class CreateBookValidator : AbstractValidator<CreateBookRequest>
{
    public CreateBookValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Title is required")
            .MaximumLength(100).WithMessage("Title cannot exceed 100 characters");

        RuleFor(x => x.ActorId)
            .NotEmpty().WithMessage("Author is required")
            .GreaterThan(0).WithMessage("CategoryId must be greater than 0");

        
        RuleFor(x => x.CategoryId)
            .NotNull().WithMessage("CategoryId is required")
            .GreaterThan(0).WithMessage("CategoryId must be greater than 0");


    }
}

