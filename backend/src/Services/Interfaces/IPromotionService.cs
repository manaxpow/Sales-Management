
public interface IPromotionService
{
    Task<ApiResponse<PromotionResponse>> CreatePromotion(CreatePromotionRequest createPromotionRequest);
    Task<ApiResponse<GetPromotionResponse>> GetPromotion(GetPromotionRequest getPromotionRequest);
    Task<ApiResponse<PromotionResponse>> GetPromotionById(int id);
    Task<ApiResponse<PromotionResponse>> UpdatePromotion(UpdatePromotionRequest updatePromotionRequest);
    Task<ApiResponse<PromotionResponse>> GetPromotionByCode(string code);
    Task<ApiResponse<bool>> IncrementUsageCount(int promotionId);
}
