using FluentValidation;
using FluentValidation.Results;

public static class AuthRoute
{
    public static IEndpointRouteBuilder MapAuthEndPoint(this IEndpointRouteBuilder group)
    {
        var AuthRoute = group.MapGroup("/auth").WithTags("Auth");
        // Define the endpoints
        // Endpoint to login
        AuthRoute.MapPost("/login", async ([AsParameters] LoginRequest loginRequest, IAuthServices authServices, IValidator<LoginRequest> validator) =>
        {
            try
            {
                ValidationResult result = await validator.ValidateAsync(loginRequest);
                if (!result.IsValid)
                {
                    return Results.BadRequest(result.Errors.Select(e => new
                    {
                        field = e.PropertyName,
                        message = e.ErrorMessage
                    }));
                }
                var auth = await authServices.Login(loginRequest);
                if (auth.Success)
                {
                    return Results.Ok(auth);

                }
                else return Results.BadRequest(auth);

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

        });
        
        AuthRoute.MapPost("/register", async ([AsParameters] RegisterRequest registerRequest, IAuthServices authServices, IValidator<RegisterRequest> validator) =>
        {
            try
            {
                ValidationResult result = await validator.ValidateAsync(registerRequest);
                if (!result.IsValid)
                {
                    return Results.BadRequest(result.Errors.Select(e => new
                    {
                        field = e.PropertyName,
                        message = e.ErrorMessage
                    }));
                }
                var auth = await authServices.Register(registerRequest);
                if (auth.Success)
                {
                    return Results.Ok(auth);

                }
                else return Results.BadRequest(auth);

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

        });
        return group;
    }
}

