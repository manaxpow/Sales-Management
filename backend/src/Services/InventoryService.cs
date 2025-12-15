using Microsoft.EntityFrameworkCore;

public class InventoryService(AppDbContext context, ILogger<InventoryService> logger) : IInventoryService
{
    public async Task<ApiResponse<GetInventoryResponse>> GetInventory(GetInventoryRequest inventoryRequest)
    {
        var response = new ApiResponse<GetInventoryResponse>();

        var query = context.Inventory
            .Include(x => x.Product)
            .Where(x => x.Product.Status != 3) // Exclude deleted products (status = 3)
            .AsQueryable();

        if (!string.IsNullOrEmpty(inventoryRequest.Search))
        {
            query = query.Where(x => x.Product.ProductName.Contains(inventoryRequest.Search));
        }

        if (!string.IsNullOrEmpty(inventoryRequest.Status))
        {
            switch (inventoryRequest.Status)
            {
                case "ALL":
                    break;
                case "IN_STOCK":
                    query = query.Where(x => x.Quantity > 10);
                    break;
                case "LOW_STOCK":
                    query = query.Where(x => x.Quantity <= 10 && x.Quantity > 0);
                    break;
                case "OUT_OF_STOCK":
                    query = query.Where(x => x.Quantity == 0);
                    break;
            }
        }

        var totalCount = await query.CountAsync();

        var inventory = await query
            .OrderBy(x => x.InventoryId)
            .Skip((inventoryRequest.Page - 1) * inventoryRequest.PageSize)
            .Take(inventoryRequest.PageSize)
            .ToListAsync();

        var dataProduct = inventory.Select(x => new ProductInventory
        {
            Id = x.InventoryId,
            ProductId = x.ProductId,
            ProductName = x.Product.ProductName,
            Quantity = x.Quantity,
            Barcode = x.Product.Barcode,
            Price = (int)x.Product.Price,
        }).ToList();

        response.Data = new GetInventoryResponse
        {
            TotalCount = totalCount,
            Products = dataProduct
        };

        return response.SuccessResponse(response.Data, "Get inventory success");
    }

    public async Task<ApiResponse<UpdateQuantityResponse>> UpdateQuantity(int Id, UpdateQuantityRequest updateQuantityRequest)
    {
        var respone = new ApiResponse<UpdateQuantityResponse>();
        var inventory = await context.Inventory.FirstOrDefaultAsync(x => x.InventoryId == Id);
        if (inventory == null)
        {
            return respone.ErrorResponse("Inventory not found");
        }
        inventory.Quantity = updateQuantityRequest.Quantity;
        await context.SaveChangesAsync();
        return respone.SuccessResponse(new UpdateQuantityResponse
        {
            Id = inventory.InventoryId,
            Quantity = inventory.Quantity
        }, "Update quantity success");
    }
}
