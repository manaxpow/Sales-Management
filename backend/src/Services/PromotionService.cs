
using System.Collections.Immutable;
using Microsoft.EntityFrameworkCore;

public class PromotionService(AppDbContext context, ILogger<PromotionService> logger) : IPromotionService
{
    private readonly AppDbContext context = context;

    private readonly ILogger<PromotionService> logger = logger;
    private readonly ApiResponse<PromotionResponse> response = new();
    private readonly ApiResponse<GetPromotionResponse> getDataRes = new();

    public async Task<ApiResponse<PromotionResponse>> CreatePromotion(CreatePromotionRequest createPromotionRequest)
    {

        var exist = await context.Promotions.AnyAsync(u => u.Code == createPromotionRequest.PromotionCode && u.Status != 3);
        if (exist)
            return new ApiResponse<PromotionResponse>().ErrorResponse("Promotion code already exists");

        if (DateTimeHelper.ConvertStringToDateTime(createPromotionRequest.StartDate) < DateTime.UtcNow)
        {
            return response.ErrorResponse("Start date must be a future date");
        }
        var promotion = new Promotions
        {
            Code = createPromotionRequest.PromotionCode,
            Description = createPromotionRequest.Description ?? string.Empty,
            DiscountType = createPromotionRequest.DiscountType,
            DiscountValue = createPromotionRequest.DiscountValue,
            MinOrderAmount = createPromotionRequest.MinOrderAmount,
            Usagelimit = createPromotionRequest.Usagelimit,
            StartDate = DateTimeHelper.ConvertStringToDateTime(createPromotionRequest.StartDate),
            EndDate = DateTimeHelper.ConvertStringToDateTime(createPromotionRequest.EndDate),
            Status = 1
        };
        context.Promotions.Add(promotion);
        await context.SaveChangesAsync();
        var Data = new PromotionResponse
        {
            PromotionId = promotion.PromotionId,
            PromotionCode = promotion.Code,
            Description = promotion.Description,
            DiscountType = promotion.DiscountType,
            DiscountValue = promotion.DiscountValue,
            MinOrderAmount = promotion.MinOrderAmount,
            Usagelimit = promotion.Usagelimit,
            Usedcount = promotion.Usedcount,
            StartDate = promotion.StartDate,
            EndDate = promotion.EndDate,
            Status = promotion.Status
        };

        return response.SuccessResponse(Data, "Create promotion success");

    }

    public async Task<ApiResponse<GetPromotionResponse>> GetPromotion(GetPromotionRequest res)
    {
        var query = context.Promotions.Where(u => u.Status != 3).AsQueryable();
        var limit = res.Limit ?? 10;
        var page = res.Page ?? 1;
        var SortBy = res.SortBy ?? "CreatedAt";
        var SortOrder = res.SortOrder ?? "desc";

        if (!string.IsNullOrEmpty(res.PromotionCode))
            query = query.Where(u => u.Code.Contains(res.PromotionCode));
        if (res.DiscountType.HasValue)
            query = query.Where(u => u.DiscountType == res.DiscountType.Value);
        if (res.Status.HasValue)
            query = query.Where(u => res.Status == u.Status);
        // sorting

        query = res.SortBy?.ToLower() switch
        {
            "promotionCode" => res.SortOrder == "asc"
                ? query.OrderBy(u => u.Code)
                : query.OrderByDescending(u => u.Code),

            "startDate" => res.SortOrder == "asc" ? query.OrderBy(u => u.StartDate)
                : query.OrderByDescending(u => u.StartDate),

            "endDate" => res.SortOrder == "asc" ? query.OrderBy(u => u.EndDate)
                : query.OrderByDescending(u => u.EndDate),
            _ => res.SortOrder == "asc"
                ? query.OrderBy(u => u.StartDate)
                : query.OrderByDescending(u => u.StartDate)
        };

        var promotions = await query
            .Select(u => new PromotionResponse
            {
                PromotionId = u.PromotionId,
                PromotionCode = u.Code,
                Description = u.Description,
                DiscountType = u.DiscountType,
                DiscountValue = u.DiscountValue,
                MinOrderAmount = u.MinOrderAmount,
                Usagelimit = u.Usagelimit,
                Usedcount = u.Usedcount,
                StartDate = u.StartDate,
                EndDate = u.EndDate,
                Status = u.Status
            }
            )
            .Skip((page - 1) * limit)
            .Take(limit)
            .ToListAsync();

        var totalRecord = await query.Where(u => u.Status != 3).CountAsync();
        var dataResponse = new GetPromotionResponse
        {
            Promotions = promotions,
            TotalPage = totalRecord / limit + (totalRecord % limit == 0 ? 0 : 1),
            TotalPromotion = totalRecord
        };
        return getDataRes.SuccessResponse(dataResponse, "Get promotion success");
    }

    public async Task<ApiResponse<PromotionResponse>> GetPromotionById(int id)
    {
        var promotion = await context.Promotions.FindAsync(id);
        if (promotion == null) return response.ErrorResponse("Promotion not found");
        var Data = new PromotionResponse
        {
            PromotionId = promotion.PromotionId,
            PromotionCode = promotion.Code,
            Description = promotion.Description,
            DiscountType = promotion.DiscountType,
            DiscountValue = promotion.DiscountValue,
            MinOrderAmount = promotion.MinOrderAmount,
            Usagelimit = promotion.Usagelimit,
            Usedcount = promotion.Usedcount,
            StartDate = promotion.StartDate,
            EndDate = promotion.EndDate
        };

        return response.SuccessResponse(Data, "Get promotion success");
    }

    public async Task<ApiResponse<PromotionResponse>> UpdatePromotion(UpdatePromotionRequest req)
    {
        var promotion = await context.Promotions.FindAsync(req.PromotionId);
        if (promotion == null) return response.ErrorResponse("Promotion not found");

        // validate 

        if (promotion.Usagelimit < promotion.Usedcount)
        {
            return response.ErrorResponse("Usage limit cannot be less than used count ");

        }
        if (req.PromotionCode != null && req.PromotionCode != promotion.Code)
        {
            var exist = await context.Promotions.AnyAsync(u => u.Code == req.PromotionCode && u.PromotionId != req.PromotionId && u.Status != 3);
            if (exist)
                return response.ErrorResponse("Promotion code already exists");
        }
        promotion.Code = req.PromotionCode ?? promotion.Code;
        promotion.Description = req.Description ?? promotion.Description;
        promotion.DiscountType = req.DiscountType ?? promotion.DiscountType;
        promotion.DiscountValue = req.DiscountValue ?? promotion.DiscountValue;
        promotion.MinOrderAmount = req.MinOrderAmount ?? promotion.MinOrderAmount;
        promotion.Status = req.Status ?? promotion.Status;
        promotion.Usagelimit = req.Usagelimit ?? promotion.Usagelimit;
        promotion.StartDate = req.StartDate != null ? DateTimeHelper.ConvertStringToDateTime(req.StartDate) : promotion.StartDate;
        promotion.EndDate = req.EndDate != null ? DateTimeHelper.ConvertStringToDateTime(req.EndDate) : promotion.EndDate;
        if (req.StartDate != null || req.EndDate != null)
        {
            if (promotion.StartDate >= promotion.EndDate)
            {
                return response.ErrorResponse("Start date must be before end date");
            }
        }

        await context.SaveChangesAsync();
        return response.SuccessResponse(new PromotionResponse
        {
            PromotionId = promotion.PromotionId,
            PromotionCode = promotion.Code,
            Description = promotion.Description,
            DiscountType = promotion.DiscountType,
            DiscountValue = promotion.DiscountValue,
            MinOrderAmount = promotion.MinOrderAmount,
            Usagelimit = promotion.Usagelimit,
            Usedcount = promotion.Usedcount,
            StartDate = promotion.StartDate,
            EndDate = promotion.EndDate,
            Status = promotion.Status
        }, "Update promotion success");
    }

    public async Task<ApiResponse<PromotionResponse>> GetPromotionByCode(string code)
    {
        if (string.IsNullOrWhiteSpace(code))
            return new ApiResponse<PromotionResponse>().ErrorResponse("Promotion code is required");

        var promo = await context.Promotions
            .FirstOrDefaultAsync(p => p.Code == code.Trim().ToUpper() && p.Status != 3);

        if (promo == null)
            return new ApiResponse<PromotionResponse>().ErrorResponse("Promotion not found");

        return new ApiResponse<PromotionResponse>().SuccessResponse(new PromotionResponse
        {
            PromotionId = promo.PromotionId,
            PromotionCode = promo.Code,
            Description = promo.Description,
            DiscountType = promo.DiscountType,
            DiscountValue = promo.DiscountValue,
            MinOrderAmount = promo.MinOrderAmount,
            Usagelimit = promo.Usagelimit,
            Usedcount = promo.Usedcount,
            StartDate = promo.StartDate,
            EndDate = promo.EndDate,
            Status = promo.Status
        });
    }

    public async Task<ApiResponse<bool>> IncrementUsageCount(int promotionId)
    {
        var promo = await context.Promotions.FindAsync(promotionId);
        if (promo == null || promo.Status == 3)
            return new ApiResponse<bool>().ErrorResponse("Promotion not found");

        if (promo.Usagelimit > 0 && promo.Usedcount >= promo.Usagelimit)
            return new ApiResponse<bool>().ErrorResponse("Usage limit exceeded");

        promo.Usedcount++;
        await context.SaveChangesAsync();

        return new ApiResponse<bool>().SuccessResponse(true);
    }
}