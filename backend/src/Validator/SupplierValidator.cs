using backend.Contract.Supplier.Request;
using FluentValidation;

namespace backend.Validation;

public class SupplierRequestValidator<T> : AbstractValidator<T> where T : ISupplierRequest
{
    public SupplierRequestValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Tên nhà cung cấp không được để trống.")
            .MaximumLength(100).WithMessage("Tên nhà cung cấp không được vượt quá 100 ký tự.");

        RuleFor(x => x.Phone)
            .NotEmpty().WithMessage("Số điện thoại không được để trống.")
            .Matches(@"^0[3|5|7|8|9][0-9]{8}$").WithMessage("Số điện thoại không đúng định dạng");

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email không được để trống.")
            .EmailAddress().WithMessage("Email không đúng định dạng.");

        RuleFor(x => x.Address)
            .MaximumLength(255).WithMessage("Địa chỉ không được vượt quá 255 ký tự.");
    }
}

public class CreateSupplierRequestValidator : SupplierRequestValidator<CreateSupplierRequest>
{
    public CreateSupplierRequestValidator() : base() { }
}

public class UpdateSupplierRequestValidator : SupplierRequestValidator<UpdateSupplierRequest>
{
    public UpdateSupplierRequestValidator() : base() { }
}
