using System.Collections.Generic;

namespace blazor_web.DTOs.Product
{
    public class GetProductResponse
    {
        public List<ProductResponse> Products { get; set; } = new List<ProductResponse>();
        public int TotalProduct { get; set; }
        public int TotalPage { get; set; }
        public int CurrentPage { get; set; }
    }
}