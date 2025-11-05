
using Microsoft.EntityFrameworkCore;

public class ProductService(AppDbContext context, ILogger<ProductService> logger) : IProductService
{
    private readonly AppDbContext context = context;

    private readonly ILogger<ProductService> logger = logger;
    private readonly ApiResponse<ProductResponse> response = new();
    private readonly ApiResponse<GetProductResponse> getDataRes = new();
    private readonly ApiResponse<List<ProductResponse>> listResponse = new();

    public async Task<ApiResponse<ProductResponse>> CreateProduct(CreateProductRequest req)
    {
        // auto genarate barcode until unique
        var barcode = BarcodeHelper.GenarateBarcode();
        while (await context.Products.AnyAsync(e => e.Barcode.Equals(barcode)))
        {
            barcode = BarcodeHelper.GenarateBarcode();
        }
        // check data exist
        bool productExists = await context.Products.AnyAsync(e => e.ProductName == req.ProductName);
        var supplier = await context.Suppliers.FindAsync(req.SupplierId);
        var category = await context.Categories.FindAsync(req.CategoryId); if (productExists) return response.ErrorResponse("Product name is duplicate");
        if (supplier == null) return response.ErrorResponse("Suppiler not found");
        if (category == null) return response.ErrorResponse("Category not found");
        var product = new Products
        {
            Barcode = barcode,
            CategoryId = req.CategoryId,
            Price = req.Price,
            ProductName = req.ProductName,
            SupplierId = req.SupplierId,
            Unit = req.Unit ?? "pcs",
            Status = req.Status ?? 1,
            CreatedAt = DateTime.Now
        };
        context.Products.Add(product);
        await context.SaveChangesAsync();
        var quantity = context.Inventory.Add(new Inventory
        {
            ProductId = product.ProductId,
            Quantity = 0
        });
        await context.SaveChangesAsync();

        var dataRes = new ProductResponse
        {
            CategoryId = product.CategoryId,
            CategoryName = category.CategoryName,
            Price = product.Price,
            ProductId = product.ProductId,
            ProductName = product.ProductName,
            Quantity = 0,
            SupplierId = product.SupplierId,
            SupplierName = supplier.Name,
            Unit = product.Unit,
            Barcode = product.Barcode

        };
        return response.SuccessResponse(dataRes, "create product success");
    }

    public async Task<ApiResponse<GetProductResponse>> GetProduct(GetProductRequest req)
    {
        var query = context.Products
        .Include(u => u.Category)
        .Include(u => u.Supplier)
        .Include(u => u.Inventory)
        .Where(u => u.Status != 3)
        .AsQueryable();
        var limit = req.Limit ?? 10;
        var page = req.Page ?? 1;
        var SortBy = req.SortBy ?? "CreatedAt";
        var SortOrder = req.SortOrder ?? "asc";
        if (!string.IsNullOrEmpty(req.Barcode))
            query = query.Where(u => u.Barcode.Equals(req.Barcode));
        if (!string.IsNullOrEmpty(req.ProductName))
            query = query.Where(u => u.ProductName.Contains(req.ProductName));
        if (req.CategoryId.HasValue)
            query = query.Where(u => u.CategoryId == req.CategoryId.Value);
        if (req.SupplierId.HasValue)
            query = query.Where(u => u.SupplierId == req.SupplierId.Value);
        if (req.Price.HasValue)
            query = query.Where(u => u.Price >= 0 && u.Price <= req.Price.Value);
        if (req.Status.HasValue)
            query = query.Where(u => u.Status == req.Status);
        query = req.SortBy?.ToLower() switch
        {
            "productname" => req.SortOrder == "asc"
                ? query.OrderBy(u => u.ProductName)
                : query.OrderByDescending(u => u.ProductName),
            "createdat" => req.SortOrder == "asc"
                           ? query.OrderBy(u => u.CreatedAt)
                           : query.OrderByDescending(u => u.CreatedAt),
            _ => req.SortOrder == "asc"
                ? query.OrderBy(u => u.CreatedAt)
                : query.OrderByDescending(u => u.CreatedAt)
        };
        var products = await query
           .Select(u => new ProductResponse
           {
               ProductId = u.ProductId,
               ProductName = u.ProductName,
               Price = u.Price,
               CategoryId = u.CategoryId,
               Status = u.Status,
               Barcode = u.Barcode,
               CategoryName = u.Category != null ? u.Category.CategoryName : null,
               SupplierId = u.SupplierId,
               Unit = u.Unit,
               SupplierName = u.Supplier != null ? u.Supplier.Name : null,
               Quantity = u.Inventory != null ? u.Inventory.Quantity : 0

           }
           )
           .Skip((page - 1) * limit)
           .Take(limit)
           .ToListAsync();

        var totalRecord = await query.CountAsync();
        var dataResponse = new GetProductResponse
        {
            Products = products,
            TotalPage = totalRecord / limit + (totalRecord % limit == 0 ? 0 : 1),
            TotalProduct = totalRecord,
            CurrentPage = page


        };
        return getDataRes.SuccessResponse(dataResponse, "Get product success");
    }

    public async Task<ApiResponse<ProductResponse>> GetProductById(int id)
    {
        try
        {
            var product = await context.Products
            .Include(u => u.Category)
            .Include(u => u.Supplier)
            .Include(u => u.Inventory)
            .Where(u => u.Status != 3)
            .FirstOrDefaultAsync(e => e.ProductId == id);
            if (product == null) return response.ErrorResponse("Product not found");
            var dataRes = new ProductResponse
            {
                ProductId = product.ProductId,
                ProductName = product.ProductName,
                Price = product.Price,
                CategoryId = product.CategoryId,
                CategoryName = product.Category != null ? product.Category.CategoryName : null,
                SupplierId = product.SupplierId,
                Unit = product.Unit,
                SupplierName = product.Supplier != null ? product.Supplier.Name : null,
                Quantity = product.Inventory != null ? product.Inventory.Quantity : 0
            };
            return response.SuccessResponse(dataRes, "Get product success");

        }
        catch
        {
            return response.ErrorResponse("unexpect error", 400);
        }
    }

    public async Task<ApiResponse<ProductResponse>> UpdateProduct(UpdateProductRequest req)
    {
        try
        {
            var product = await context.Products
            .Include(u => u.Category)
            .Include(u => u.Supplier)
            .Include(u => u.Inventory)
            .Where(u => u.Status != 3)
            .FirstOrDefaultAsync(u => u.ProductId == req.ProductId);
            if (product == null) return response.ErrorResponse("Product not found");
            var productExists = await context.Products.FirstOrDefaultAsync(e => e.ProductName == req.ProductName);
            logger.LogInformation("check value" + req.SupplierId);
            if (req.CategoryId.HasValue)
            {
                var category = await context.Categories.FindAsync(req.CategoryId);
                if (category == null) return response.ErrorResponse("Category not found");
            }
            if (req.SupplierId.HasValue)
            {
                var supplier = await context.Suppliers.FindAsync(req.SupplierId);
                if (supplier == null) return response.ErrorResponse("Suppiler not found");
            }

            if (productExists != null && productExists.ProductId != req.ProductId) return response.ErrorResponse("Product name is duplicate");
            product.CategoryId = req.CategoryId ?? product.CategoryId;
            product.Price = req.Price ?? product.Price;
            product.ProductName = req.ProductName ?? product.ProductName;
            product.SupplierId = req.SupplierId ?? product.SupplierId;
            product.Status = req.Status ?? product.Status;
            product.Unit = req.Unit ?? product.Unit;
            await context.SaveChangesAsync();
            var dataRes = new ProductResponse
            {
                CategoryId = product.CategoryId,
                Price = product.Price,
                ProductId = product.ProductId,
                ProductName = product.ProductName,
                Quantity = 0,
                SupplierId = product.SupplierId,
                Unit = product.Unit,
                Barcode = product.Barcode,
                Status = product.Status,
                CategoryName = product?.Category?.CategoryName,
                SupplierName = product?.Supplier?.Name,
            };
            return response.SuccessResponse(dataRes, "Update product success");
        }
        catch (Exception ex)
        {
            return response.ErrorResponse("Update fail with mess:" + ex.Message, 400);
        }
    }


    public async Task<ApiResponse<List<ProductResponse>>> GetProductsBySupplierIdAsync(int supplierId)
    {
        try
        {
            var supplierExists = await context.Suppliers.AnyAsync(s => s.Id == supplierId);
            if (!supplierExists)
            {
                return listResponse.ErrorResponse("Supplier not found", 404); 
            }
            var products = await context.Products
                .Include(u => u.Category)
                .Include(u => u.Supplier) 
                .Include(u => u.Inventory)
                .Where(u => u.SupplierId == supplierId && u.Status != 3)
                .Select(u => new ProductResponse
                {
                    ProductId = u.ProductId,
                    ProductName = u.ProductName,
                    Price = u.Price,
                    CategoryId = u.CategoryId,
                    Status = u.Status,
                    Barcode = u.Barcode,
                    CategoryName = u.Category != null ? u.Category.CategoryName : null,
                    SupplierId = u.SupplierId,
                    Unit = u.Unit,
                    SupplierName = u.Supplier != null ? u.Supplier.Name : null,
                    Quantity = u.Inventory != null ? u.Inventory.Quantity : 0
                })
                .ToListAsync();

            return listResponse.SuccessResponse(products, "Get products by supplier success");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error getting products for supplier {SupplierId}", supplierId);
            return listResponse.ErrorResponse("An unexpected error occurred", 400); 
        }
    }


}