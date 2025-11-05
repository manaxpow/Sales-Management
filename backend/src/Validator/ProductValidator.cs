using FluentValidation;

public class GetProductValidator : AbstractValidator<GetProductRequest>
{
    public GetProductValidator()
    {
        RuleFor(x => x.CategoryId)
        .GreaterThan(0).WithMessage("Category id value is invalid");
        RuleFor(x => x.SupplierId)
        .GreaterThan(0).WithMessage("Supplier id value is invalid");
        RuleFor(x => x.Price)
        .GreaterThan(0).WithMessage("Price value is invalid");
        RuleFor(x => x.Limit)
            .GreaterThan(0).WithMessage("Limit must be greater than 0");
        RuleFor(x => x.Page)
            .GreaterThan(0).WithMessage("Page must be greater than 0");
        RuleFor(x => x.SortOrder)
            .Must(sortOrder => sortOrder == null || sortOrder.ToLower() == "asc" || sortOrder.ToLower() == "desc")
            .WithMessage("Sort order must be either 'asc' or 'desc'");
        RuleFor(x => x.SortBy)
            .Must(sortBy => sortBy == null || sortBy == "CreatedAt" || sortBy == "PromotionCode" || sortBy == "DiscountType")
            .WithMessage("Sort by must be one of the following: 'CreatedAt', 'PromotionCode', 'DiscountType'");
    }


}

public class CreateProductValidator : AbstractValidator<CreateProductRequest>
{
    public CreateProductValidator()
    {

        RuleFor(x => x.ProductName)
       .MinimumLength(6)
       .MaximumLength(100)
       .WithMessage("Product name is between 5 to 100 character");
        RuleFor(x => x.CategoryId)
       .GreaterThan(0).WithMessage("Category id value is invalid");
        RuleFor(x => x.SupplierId)
        .GreaterThan(0).WithMessage("Supplier id value is invalid");
        RuleFor(x => x.Price)
        .GreaterThan(0).WithMessage("Price value is invalid");
        RuleFor(x => x.Status).InclusiveBetween(1, 2).WithMessage("Product status value is invalid");
    }
}

public class UpdateProductValidator : AbstractValidator<UpdateProductRequest>
{
    public UpdateProductValidator()
    {
        RuleFor(x => x.ProductId).GreaterThan(0).WithMessage("Product id value is invalid");
        RuleFor(x => x.Status).InclusiveBetween(1, 3).WithMessage("Product status value is invalid");
        RuleFor(x => x.ProductName)
       .MinimumLength(6)
       .MaximumLength(100)
       .WithMessage("Product name is between 5 to 100 character");
        RuleFor(x => x.CategoryId)
       .GreaterThan(0).WithMessage("Category id value is invalid");
        RuleFor(x => x.SupplierId)
        .GreaterThan(0).WithMessage("Supplier id value is invalid");
        RuleFor(x => x.Price)
        .GreaterThan(0).WithMessage("Price value is invalid");


    }
}



