using FluentValidation;

public class GetHistoryRequestValidator : AbstractValidator<GetHistoryRequest>
{
    public GetHistoryRequestValidator()
    {
        RuleFor(x => x.UserId)
            .GreaterThan(0).WithMessage("UserId must be greater than 0");

        RuleFor(x => x.Page)
            .GreaterThan(0).WithMessage("Page must be greater than 0");

        RuleFor(x => x.PageSize)
            .GreaterThan(0).WithMessage("PageSize must be greater than 0")
            .LessThanOrEqualTo(100).WithMessage("PageSize must not exceed 100");

        RuleFor(x => x.Status)
            .GreaterThanOrEqualTo(0).WithMessage("Status must be >= 0")
            .When(x => x.Status.HasValue);

        RuleFor(x => x.DateFrom)
            .LessThanOrEqualTo(x => x.DateTo)
            .WithMessage("DateFrom must be less than or equal to DateTo")
            .When(x => x.DateFrom.HasValue && x.DateTo.HasValue);
    }
}

public class GetHistoryDetailRequestValidator : AbstractValidator<GetHistoryDetailRequest>
{
    public GetHistoryDetailRequestValidator()
    {
        RuleFor(x => x.UserId)
            .GreaterThan(0).WithMessage("UserId must be greater than 0");

        RuleFor(x => x.OrderId)
            .GreaterThan(0).WithMessage("OrderId must be greater than 0");
    }
}
