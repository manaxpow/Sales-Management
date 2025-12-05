public class CategoryService
{
    private readonly HttpClient http;
    public CategoryService(HttpClient http) => this.http = http;

    public async Task<ApiResponse<List<CategoryResponse>>> GetAll()
        => await http.GetFromJsonAsync<ApiResponse<List<CategoryResponse>>>("api/category") ?? new();

    public async Task<ApiResponse<CategoryResponse>> Create(CategoryCreateRequest req)
        => await http.PostAsJsonAsync("api/category", req)
                    .Result.Content.ReadFromJsonAsync<ApiResponse<CategoryResponse>>() ?? new();

    public async Task<ApiResponse<CategoryResponse>> Update(int id, CategoryCreateRequest req)
        => await http.PutAsJsonAsync($"api/category/{id}", req)
                    .Result.Content.ReadFromJsonAsync<ApiResponse<CategoryResponse>>() ?? new();

    public async Task<ApiResponse<bool>> Delete(int id)
        => await http.DeleteFromJsonAsync<ApiResponse<bool>>($"api/category/{id}") ?? new();
}

public record CategoryCreateRequest(string Name);
public record CategoryResponse(int Id, string Name);