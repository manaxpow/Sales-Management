
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

public class ChangePasswordValidator : AbstractValidator<ChangePasswordRequest>
{
    public ChangePasswordValidator()
    {
        RuleFor(x => x.UserId)
            .GreaterThan(0).WithMessage("UserId phải lớn hơn 0");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Mật khẩu hiện tại không được để trống")
            .MinimumLength(6).WithMessage("Mật khẩu hiện tại tối thiểu 6 kí tự");

        RuleFor(x => x.NewPassword)
            .NotEmpty().WithMessage("Mật khẩu mới không được để trống")
            .MinimumLength(6).WithMessage("Mật khẩu mới tối thiểu 6 kí tự")
            .NotEqual(x => x.Password).WithMessage("Mật khẩu mới phải khác mật khẩu hiện tại");
    }
}
