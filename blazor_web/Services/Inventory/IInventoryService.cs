using blazor_web.Models;
using blazor_web.DTOs.Inventory;

namespace blazor_web.Services.Inventory
{
    public interface IInventoryService
    {
        Task<ApiResponse<GetInventoryResponse>> GetInventoryAsync(GetInventoryRequest request);
        Task<ApiResponse<UpdateQuantityResponse>> UpdateQuantityAsync(int id, UpdateQuantityRequest request);
    }
}
