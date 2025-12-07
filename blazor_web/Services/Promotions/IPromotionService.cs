using blazor_web.Models;


public interface IPromotionService
{
    Task<ApiResponse<GetAllPromotionResponse>> GetAll(GetAllPromotionReq request);
    Task<ApiResponse<GetPromotionRes>> GetPromotionById(int id);
    Task<ApiResponse<PromotionRes>> CreatePromotion(CreatePromotionReq request);
    Task<ApiResponse<PromotionRes>> UpdatePromotion(UpdatePromotionReq request);

    Task<ApiResponse<PromotionRes>> DeletePromotion(DeletePromotionReq request);

}

