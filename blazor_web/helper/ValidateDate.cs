using System.ComponentModel.DataAnnotations;

public class ValidateStartDateAttribute : ValidationAttribute
{
    protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
    {
        if (value is not DateOnly startDate)
            return ValidationResult.Success;

        var today = DateOnly.FromDateTime(DateTime.Today);;

        if (startDate <= today)
        {
            return new ValidationResult("Start date must be today or later.");
        }

        return ValidationResult.Success;
    }
}


public class ValidateEndDateAttribute : ValidationAttribute
{
    private readonly string _startDateProperty;

    public ValidateEndDateAttribute(string startDateProperty)
    {
        _startDateProperty = startDateProperty;
    }

    protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
    {

        if (value is not DateOnly endDate)
            return ValidationResult.Success;
        var startProp = validationContext.ObjectType.GetProperty(_startDateProperty);
        if (startProp == null)
            return new ValidationResult("Start date property not found.");

        var startValue = startProp.GetValue(validationContext.ObjectInstance);

        if (startValue is DateOnly startDate)
        {
            if (endDate <= startDate)
            {
                return new ValidationResult("End date must be after or equal to start date.");
            }
        }

        return ValidationResult.Success;
    }
}
