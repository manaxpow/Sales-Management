using FluentValidation;
using FluentValidation.Results;

public static class PromotionRoute
{
    public static IEndpointRouteBuilder MapPromotionEndPoint(this IEndpointRouteBuilder group)
    {
        var PromotionRoute = group.MapGroup("/promotion").WithTags("Promotion");
        PromotionRoute.MapPost("/", async ([AsParameters] CreatePromotionRequest createPromotionRequest, IPromotionService promotionService, IValidator<CreatePromotionRequest> validator) =>
        {
            try
            {
                ValidationResult result = await validator.ValidateAsync(createPromotionRequest);
                if (!result.IsValid)
                {
                    return Results.Json(result.Errors.Select(e => new
                    {
                        field = e.PropertyName,
                        message = e.ErrorMessage
                    }), statusCode: 400);
                }
                var promotion = await promotionService.CreatePromotion(createPromotionRequest);
                if (promotion.Data == null)
                {
                    return Results.Json(new
                    {
                        message = promotion.Message,
                        status = promotion.Success
                    }, statusCode: 400);
                }

                return Results.Created($"/promotion/{promotion.Data.PromotionId}", promotion);
            }
            catch (Exception e)
            {
                Console.WriteLine("Error", e.Data);
                var err = new ErrorResponse
                {
                    Message = e.Message.ToString() ?? "Lỗi không xác định",
                    StatusCode = 400,
                    Title = "Something wrong"
                };
                return Results.Json(err);
            }
            // validate
        }).RequireAuthorization();
        // get promotion 
        PromotionRoute.MapGet("/", async ([AsParameters] GetPromotionRequest getPromotionRequest, IPromotionService promotionService, IValidator<GetPromotionRequest> validator) =>
            {
                try
                {
                    ValidationResult result = await validator.ValidateAsync(getPromotionRequest);
                    if (!result.IsValid)
                    {
                        return Results.BadRequest(result.Errors.Select(e => new
                        {
                            field = e.PropertyName,
                            message = e.ErrorMessage
                        }));
                    }
                    var promotion = await promotionService.GetPromotion(getPromotionRequest);
                    if (promotion.Data == null)
                    {
                        return Results.BadRequest(new
                        {
                            mess = "Get promotion failed"
                        });
                    }
                    return Results.Ok(promotion);
                }
                catch (Exception e)
                {
                    Console.WriteLine("Error", e.Data);
                    var err = new ErrorResponse
                    {
                        Message = e.Message.ToString() ?? "Un expected error",
                        StatusCode = 400,
                        Title = "Something wrong"
                    };
                    return Results.Json(err);
                }
            });
        PromotionRoute.MapGet("/{id:int}", async (int id, IPromotionService promotionService) =>
        {
            try
            {
                var promotion = await promotionService.GetPromotionById(id);
                if (promotion.Data == null)
                {
                    return Results.BadRequest(new { mess = promotion.Message, status = promotion.Success });
                }
                return Results.Ok(promotion);
            }
            catch (Exception e)
            {
                Console.WriteLine("Error", e.Data);
                var err = new ErrorResponse
                {
                    Message = e.Message.ToString() ?? "Un expected error",
                    StatusCode = 400,
                    Title = "Something wrong"
                };
                return Results.Json(err);
            }
        });

        // udpate 
        PromotionRoute.MapPatch("/", async ([AsParameters] UpdatePromotionRequest req, IPromotionService promotionService, IValidator<UpdatePromotionRequest> validator) =>
        {
            try
            {
                ValidationResult result = await validator.ValidateAsync(req);
                if (!result.IsValid)
                {
                    return Results.BadRequest(result.Errors.Select(e => new
                    {
                        field = e.PropertyName,
                        message = e.ErrorMessage
                    }));
                }
                var promotion = await promotionService.UpdatePromotion(req);
                if (promotion.Data == null)
                {
                    return Results.BadRequest(new { message = promotion.Message, status = promotion.Success });
                }

                return Results.Ok(promotion);
            }
            catch (Exception e)
            {
                Console.WriteLine("Error", e.Data);
                var err = new ErrorResponse
                {
                    Message = e.Message.ToString() ?? "Lỗi không xác định",
                    StatusCode = 400,
                    Title = "Something wrong"
                };
                return Results.Json(err);
            }
        }).RequireAuthorization();
        return group;
    }
}

