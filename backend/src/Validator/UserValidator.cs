using FluentValidation;
using System.Text.RegularExpressions;

public class UserValidator : AbstractValidator<Users> {
    public UserValidator() {
        RuleFor(x => x.UserName)
            .NotEmpty().WithMessage("UserName is required")
            .MinimumLength(4).WithMessage("UserName must be at least 4 characters long")
            .MaximumLength(50).WithMessage("UserName must be less than or equal to 50 characters");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Password is required")
            .MinimumLength(6).WithMessage("Password must be at least 6 characters long")
            .Matches(@"^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$")
            .WithMessage("Password must contain uppercase, lowercase, and a digit");

        RuleFor(x => x.FullName)
            .NotEmpty().WithMessage("FullName is required")
            .MaximumLength(100).WithMessage("FullName must be less than or equal to 100 characters");

    }
}
