using backend.Contract.Supplier.Request;
using FluentValidation;
public class CreateSupplierRequestValidator : AbstractValidator<CreateSupplierRequest>
{
    public CreateSupplierRequestValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(100).WithMessage("Không được trống");
        RuleFor(x => x.Phone).NotEmpty().Matches(@"^(\+84|0)[3|5|7|8|9][0-9]{8}$").WithMessage("Số điện thoại không hợp lệ");
        RuleFor(x => x.Email).NotEmpty().EmailAddress().WithMessage("Email không hợp lệ.");
        RuleFor(x => x.Address).NotEmpty().MaximumLength(255).WithMessage("Không được trống.");
    }
}

public class UpdateSupplierRequestValidator : AbstractValidator<UpdateSupplierRequest>
{
    public UpdateSupplierRequestValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(100).WithMessage("Không được trống");
        RuleFor(x => x.Phone).NotEmpty().Matches(@"^(\+84|0)[3|5|7|8|9][0-9]{8}$").WithMessage("Số điện thoại không hợp lệ");
        RuleFor(x => x.Email).NotEmpty().EmailAddress().WithMessage("Email không hợp lệ.");
        RuleFor(x => x.Address).NotEmpty().MaximumLength(255).WithMessage("Không được trống.");
    }
}

public static class SupplierValidationRules
{
    public static IRuleBuilderOptions<T, string> ApplyNameRule<T>(IRuleBuilder<T, string> ruleBuilder)
    {
        return ruleBuilder.NotEmpty().MaximumLength(100).WithMessage("Không được trống");
    }

}