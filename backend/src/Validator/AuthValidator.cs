
using FluentValidation;

public class AuthValidator : AbstractValidator<LoginRequest>
{

    public AuthValidator()
    {
        RuleFor(x => x.UserName)
            .NotEmpty().WithMessage("yêu cầu username")
            .MaximumLength(100).WithMessage("User name ít hơn 100 kí tự")
            .MinimumLength(5).WithMessage("User name tối thiểu 5 kí tự");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("password không được để trống")
           .MinimumLength(6).WithMessage("Mật khẩu tối thiểu 6 kí tự");

    }
}
