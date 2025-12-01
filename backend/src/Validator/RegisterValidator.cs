
using FluentValidation;

public class RegisterValidator : AbstractValidator<RegisterRequest>
{

    public RegisterValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("yêu cầu email")
            .EmailAddress().WithMessage("Email khóa chính");

        RuleFor(x => x.FullName)
            .NotEmpty().WithMessage("yêu cầu full name")
            .MaximumLength(100).WithMessage("Full name ít hơn 100 kí tự")
            .MinimumLength(5).WithMessage("Full name tối thiểu 5 kí tự");

        RuleFor(x => x.UserName)
            .NotEmpty().WithMessage("yêu cầu username")
            .MaximumLength(100).WithMessage("User name ít hơn 100 kí tự")
            .MinimumLength(5).WithMessage("User name tối thiểu 5 kí tự");

        RuleFor(x => x.Phone)
            .NotEmpty().WithMessage("yêu cầu phone")
            .Matches(@"^0[3|5|7|8|9][0-9]{8}$").WithMessage("Số điện thoại không đúng định dạng");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("password không được để trống")
           .MinimumLength(6).WithMessage("Mật khẩu tối thiểu 6 kí tự");

        RuleFor(x => x.Address)
            .MaximumLength(255).WithMessage("Địa chỉ ít hơn 255 kí tự.");

    }
}
