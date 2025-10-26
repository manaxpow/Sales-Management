using Microsoft.EntityFrameworkCore;
using SRC.Contract.Category.request;
using SRC.Contract.Category.response;
using SRC.Services.Interfaces;

namespace SRC.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly AppDbContext _context;

        public CategoryService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<CategoryResponse>> GetAllAsync()
        {
            return await _context.Categories
                .Select(c => new CategoryResponse
                {
                    CategoryId = c.CategoryId,
                    CategoryName = c.CategoryName
                })
                .ToListAsync();
        }

        public async Task<CategoryResponse?> GetByIdAsync(int id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null) return null;

            return new CategoryResponse
            {
                CategoryId = category.CategoryId,
                CategoryName = category.CategoryName
            };
        }

        public async Task<CategoryResponse> CreateAsync(CreateCategoryRequest request)
        {
            var isExist = await _context.Categories
                .AnyAsync(c => c.CategoryName.ToLower() == request.CategoryName.ToLower());

            if (isExist)
                throw new Exception($"Category name '{request.CategoryName}' already exists.");

            var entity = new Categories
            {
                CategoryName = request.CategoryName
            };

            _context.Categories.Add(entity);
            await _context.SaveChangesAsync();

            return new CategoryResponse
            {
                CategoryId = entity.CategoryId,
                CategoryName = entity.CategoryName
            };
        }

        public async Task<CategoryResponse> UpdateAsync(UpdateCategoryRequest request)
        {
            var entity = await _context.Categories.FindAsync(request.CategoryId);
            if (entity == null)
                throw new Exception($"Category with ID {request.CategoryId} not found.");

            var isExist = await _context.Categories
                .AnyAsync(c => c.CategoryName.ToLower() == request.CategoryName.ToLower()
                            && c.CategoryId != request.CategoryId);

            if (isExist)
                throw new Exception($"Category name '{request.CategoryName}' already exists.");

            entity.CategoryName = request.CategoryName;
            await _context.SaveChangesAsync();

            return new CategoryResponse
            {
                CategoryId = entity.CategoryId,
                CategoryName = entity.CategoryName
            };
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var entity = await _context.Categories.FindAsync(id);
            if (entity == null)
                throw new Exception($"Category with ID {id} not found.");

            _context.Categories.Remove(entity);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
