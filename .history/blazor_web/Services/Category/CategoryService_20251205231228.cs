using blazor_web.Models;
using blazor_web.DTOs.Category;
using System.Net.Http.Json;

public class CategoryService
{
    private readonly HttpClient _http;

    public CategoryService(HttpClient http)
    {
        _http = http;
    }

    public async Task<List<Category>> GetAll()
    {
        return await _http.GetFromJsonAsync<List<Category>>("api/category")
            ?? new List<Category>();
    }

    public async Task<Category?> Create(CategoryRequest req)
    {
        var res = await _http.PostAsJsonAsync("api/category", req);
        return await res.Content.ReadFromJsonAsync<Category>();
    }

    public async Task<Category?> Update(int id, CategoryRequest req)
    {
        var res = await _http.PutAsJsonAsync($"api/category/{id}", req);
        return await res.Content.ReadFromJsonAsync<Category>();
    }

    public async Task<bool> Delete(int id)
    {
        var res = await _http.DeleteAsync($"api/category/{id}");
        return res.IsSuccessStatusCode;
    }
}
