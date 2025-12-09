namespace blazor_web.Models;

public class ApiResponseWrapper<T> : ApiResponse<T>
{
    public ApiResponseWrapper()
    {
        Message = string.Empty;
    }
}

public class ApiResponseWrapper : ApiResponse<object>
{
    public ApiResponseWrapper()
    {
        Message = string.Empty;
    }
}