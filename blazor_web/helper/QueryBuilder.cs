public static class QueryBuilder
{
    public static string BuildQuery<T>(T obj)
    {
        if (obj == null) return string.Empty;

        var properties = typeof(T).GetProperties();
        var queryParts = new List<string>();

        foreach (var prop in properties)
        {
            var value = prop.GetValue(obj);

            if (value == null) continue;              // bỏ null
            if (value.ToString() == "") continue;     // bỏ rỗng

            queryParts.Add($"{prop.Name.ToLower()}={Uri.EscapeDataString(value.ToString()!)}");
        }

        return string.Join("&", queryParts);
    }
}
