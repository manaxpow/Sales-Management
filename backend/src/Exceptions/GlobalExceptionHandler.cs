using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Http;
using System.Net;
using System.Text.Json;

public class GlobalExceptionHandler : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(HttpContext httpContext, Exception exception, CancellationToken cancellationToken)
    {
        httpContext.Response.ContentType = "application/json";

        var statusCode = exception switch
        {
            BadHttpRequestException => (int)HttpStatusCode.BadRequest,
            KeyNotFoundException => (int)HttpStatusCode.NotFound,
            ArgumentException => (int)HttpStatusCode.BadRequest,
            _ => (int)HttpStatusCode.InternalServerError
        };

        httpContext.Response.StatusCode = statusCode;

        var errorResponse = new
        {
            error = true,
            message = exception switch
            {
                BadHttpRequestException badReq => $"Bad request: {badReq.Message}",
                ArgumentException arg => $"Invalid value: {arg.Message}",
                _ => "Unknow error."
            },
            statusCode
        };

        await httpContext.Response.WriteAsync(JsonSerializer.Serialize(errorResponse), cancellationToken);

        return true; // Đã xử lý xong lỗi
    }
}
