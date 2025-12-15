using FluentValidation;
using FluentValidation.Results;

public static class StatisticRoute
{
    public static IEndpointRouteBuilder MapStatisticEndPoint(this IEndpointRouteBuilder group)
    {
        var StatisticRoute = group.MapGroup("/statistic").WithTags("Statistic");
        StatisticRoute.MapGet("/revenue",
            async ([AsParameters] StatisticRequest statisticRequest, IStatisticService statisticService,
                IValidator<StatisticRequest> validator) =>
            {
                try
                {
                    ValidationResult result = await validator.ValidateAsync(statisticRequest);
                    if (!result.IsValid)
                    {
                        return Results.Json(result.Errors.Select(e => new
                        {
                            field = e.PropertyName,
                            message = e.ErrorMessage
                        }), statusCode: 400);
                    }

                    var statistic = await statisticService.GetStatisticRevenue(statisticRequest);
                    if (statistic.Data == null)
                    {
                        return Results.Json(new
                        {
                            message = statistic.Message,
                            status = statistic.Success
                        }, statusCode: 400);
                    }

                    return Results.Ok(statistic);
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
            });
        // statistic order
        StatisticRoute.MapGet("/order",
            async ([AsParameters] StatisticRequest OrderRequest, IStatisticService statisticService,
                IValidator<StatisticRequest> validator) =>
            {
                try
                {
                    ValidationResult result = await validator.ValidateAsync(OrderRequest);
                    if (!result.IsValid)
                    {
                        return Results.Json(result.Errors.Select(e => new
                        {
                            field = e.PropertyName,
                            message = e.ErrorMessage
                        }), statusCode: 400);
                    }

                    var statistic = await statisticService.GetStatisticOrder(OrderRequest);
                    if (statistic.Data == null)
                    {
                        return Results.Json(new
                        {
                            message = statistic.Message,
                            status = statistic.Success
                        }, statusCode: 400);
                    }

                    return Results.Ok(statistic);
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
            });


        // statistic product
        StatisticRoute.MapGet("/product/{type}",
            async (IStatisticService statisticService, string type) =>
            {
                try
                {
                    var statistic = await statisticService.GetStatisticProduct(type);
                    if (statistic.Data == null)
                    {
                        return Results.NotFound(new
                        {
                            message = statistic.Message
                        });
                    }

                    return Results.Ok(statistic);
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
            });

        StatisticRoute.MapGet("/customer",
            async (IStatisticService statisticService) =>
            {
                try
                {
                    var statistic = await statisticService.GetStatisticCustomer();
                    if (statistic.Data == null)
                    {
                        return Results.Json(new
                        {
                            message = statistic.Message,
                            status = statistic.Success
                        }, statusCode: 400);
                    }

                    return Results.Ok(statistic);
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
            });

        return group;
    }
}

