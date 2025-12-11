using System.ComponentModel.DataAnnotations;

public class ProductFilter
{
    public int? SupplierId { get; set; }
    public int? CategoryId { get; set; }
    public string? ProductName { get; set; } = string.Empty;
    public decimal? Price { get; set; }
    public int? Page { get; set; }
    public int? Limit { get; set; }
    public int? Status { get; set; }
    public string? SortBy { get; set; } = string.Empty;
    public string? SortOrder { get; set; } = string.Empty;

}

public class CreateProductRequest
{

    [Required(ErrorMessage = "Vui lòng chọn danh mục.")]
    [Range(1, int.MaxValue, ErrorMessage = "Danh mục không hợp lệ.")]
    public int CategoryId { get; set; }

    [Required(ErrorMessage = "Vui lòng chọn nhà cung cấp.")]
    [Range(1, int.MaxValue, ErrorMessage = "Nhà cung cấp không hợp lệ.")]
    public int SupplierId { get; set; }

    [Required(ErrorMessage = "Vui lòng nhập tên sản phẩm.")]
    [StringLength(150, ErrorMessage = "Tên sản phẩm không được quá 150 ký tự.")]
    public string ProductName { get; set; } = string.Empty;

    public string Barcode { get; set; } = string.Empty;

    [Required(ErrorMessage = "Vui lòng nhập giá bán.")]
    [Range(typeof(decimal), "1000", "1000000000", ErrorMessage = "Giá phải lớn hơn 1000 và nhỏ hơn hoặc bằng 1.000.000.000")]

    public decimal Price { get; set; }

    [Required(ErrorMessage = "Vui lòng nhập đơn vị tính.")]
    [StringLength(20, ErrorMessage = "Đơn vị tính không được quá 20 ký tự.")]
    public string Unit { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.Now;
    public DateTime? UpdatedAt { get; set; }
    public string? ImageProduct { get; set; }
}

public class UpdateProductRequest : CreateProductRequest
{
    public int ProductId { get; set; }
    public int Status { get; set; }
}


public class DeleteProductRequest
{
    public int ProductId { get; set; }
    public int Status { get; set; }
}

public class GetProductRequest
{
    public ProductFilter? Filter { get; set; } = new ProductFilter();
}
public class GetProductByIdRes
{
    public int ProductId { get; set; }
public record GetProductRequest
{
    public string? ProductName { get; init; } = string.Empty;

    public int? SupplierId { get; init; }

    public int? CategoryId { get; init; }

    public string? Barcode { get; init; }

    public decimal? Price { get; init; }

    public int? Limit { get; init; } = 10;

    public int? Page { get; init; } = 1;

    public int? Status { get; init; }

    public string? SortBy { get; init; } = "CreatedAt";

    public string? SortOrder { get; init; } = "desc";


}