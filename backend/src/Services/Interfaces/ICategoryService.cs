using SRC.Contract.Category.request;
using SRC.Contract.Category.response;

namespace SRC.Services.Interfaces
{
    public interface ICategoryService
    {
        Task<IEnumerable<CategoryResponse>> GetAllAsync();
        Task<CategoryResponse?> GetByIdAsync(int id);
        Task<CategoryResponse> CreateAsync(CreateCategoryRequest request);
        Task<CategoryResponse> UpdateAsync(UpdateCategoryRequest request);
        Task<bool> DeleteAsync(int id);
    }
}
