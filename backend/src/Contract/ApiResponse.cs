
using backend.src.Contract.Auth.Response;

public class ApiResponse<T>
{
    public T? Data { get; set; }
    public string? Message { get; set; }
    public bool Success { get; set; }

    public ApiResponse(T data, string message, bool success)
    {
        Data = data;
        Message = message;
        Success = success;

    }

    public ApiResponse() { }
    public ApiResponse<T> SuccessResponse(T data, string message = "Success", int statusCode = 200)
    {
        Data = data;
        Message = message;
        Success = true;
        return this;
    }

    public ApiResponse<T> ErrorResponse(string message, int statusCode = 400)
    {
        Data = default;
        Message = message;
        Success = false;
        return this;
    }

    internal ApiResponse<LoginResponse> SuccessResponse()
    {
        throw new NotImplementedException();
    }
}

