public static class FormBindingExtensions
{
    public static async Task<T> BindFormAsync<T>(this HttpRequest request)
        where T : class, new()
    {
        var form = await request.ReadFormAsync();
        var obj = new T();

        foreach (var prop in typeof(T).GetProperties())
        {
            if (prop.PropertyType == typeof(IFormFile))
            {
                var file = form.Files.GetFile(prop.Name);
                if (file != null) prop.SetValue(obj, file);
            }
            else if (form.TryGetValue(prop.Name, out var value))
            {
                var converted = Convert.ChangeType(value.ToString(), prop.PropertyType);
                prop.SetValue(obj, converted);
            }
        }

        return obj;
    }
}

