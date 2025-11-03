using Microsoft.EntityFrameworkCore;
using MySqlConnector;
using System.Net;
using System.Text.Json;

public class CustomExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<CustomExceptionMiddleware> _logger;

    public CustomExceptionMiddleware(RequestDelegate next, ILogger<CustomExceptionMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task Invoke(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (BadHttpRequestException ex)
        {
            _logger.LogWarning("Bad request: {Message}", ex.Message);

            await WriteErrorResponse(context, HttpStatusCode.BadRequest, ex.Message);
        }
        catch (DbUpdateException ex)
        {
            // Kiểm tra inner MySQL exception
            if (ex.InnerException is MySqlException mysqlEx)
            {
                // Kiểm tra lỗi ràng buộc FK (ErrorCode: 1452)
                if (mysqlEx.ErrorCode == MySqlErrorCode.NoReferencedRow2)
                {
                    _logger.LogWarning("Foreign key violation: {Message}", mysqlEx.Message);

                    await WriteErrorResponse(context, HttpStatusCode.BadRequest, "Dữ liệu không hợp lệ: bản ghi tham chiếu không tồn tại.");
                    return;
                }
            }

            _logger.LogError(ex, "Database update error: {Message}", ex.Message);
            await WriteErrorResponse(context, HttpStatusCode.InternalServerError, "Lỗi cập nhật cơ sở dữ liệu.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unhandled error: {Message}", ex.Message);
            await WriteErrorResponse(context, HttpStatusCode.InternalServerError, "Đã xảy ra lỗi hệ thống.");
        }
    }

    private static async Task WriteErrorResponse(HttpContext context, HttpStatusCode statusCode, string message)
    {
        context.Response.StatusCode = (int)statusCode;
        context.Response.ContentType = "application/json";
        var result = JsonSerializer.Serialize(new
        {
            error = true,
            message
        });
        await context.Response.WriteAsync(result);
    }
}
