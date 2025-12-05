
public interface IInventoryService
{
    Task<ApiResponse<GetInventoryResponse>> GetInventory(GetInventoryRequest inventoryRequest);
    Task<ApiResponse<UpdateQuantityResponse>> UpdateQuantity(int Id, UpdateQuantityRequest updateQuantityRequest);
}
