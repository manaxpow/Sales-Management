using FluentValidation;

public class StatisticValidator : AbstractValidator<StatisticRequest>
{


    public StatisticValidator()
    {
        RuleFor(x => x.StartDate)
            .Must(DateTimeHelper.BeValidDate)
            .WithMessage("Invalid date format. Please provide a valid date in ISO 8601 format.")
            .WithMessage("Start date must be a future date");
        RuleFor(x => x.EndDate)
            .Must(DateTimeHelper.BeValidDate)
            .WithMessage("Invalid date format. Please provide a valid date in ISO 8601 format.");
        RuleFor(x => x)
        .Must(x =>
        {
            var start = DateTimeHelper.ConvertStringToDateTime(x.StartDate);
            var end = DateTimeHelper.ConvertStringToDateTime(x.EndDate);
            return start <= end;
        })
        .WithMessage("Start date must be before end date");
    }

}