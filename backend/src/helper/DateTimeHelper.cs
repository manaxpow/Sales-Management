using System.Globalization;

public static class DateTimeHelper
{
    /// <summary>
    /// Chuyển đổi chuỗi sang DateTime theo định dạng chỉ định.
    /// </summary>
    /// <param name="dateString">Chuỗi ngày cần chuyển</param>
    /// <param name="format">Định dạng ngày (ví dụ "dd/MM/yyyy" hoặc "yyyy-MM-dd HH:mm:ss")</param>
    /// <returns>Giá trị DateTime nếu hợp lệ, null nếu không hợp lệ</returns>
    public static DateTime ConvertStringToDateTime(string dateString, string format = "yyyy/MM/dd")
    {
        if (string.IsNullOrWhiteSpace(dateString))
            throw new ArgumentException("Date string cannot be null or empty.", nameof(dateString));

        if (DateTime.TryParseExact(
            dateString,
            format,
            CultureInfo.InvariantCulture,
            DateTimeStyles.None,
            out DateTime result))
        {
            return result;
        }
        Console.WriteLine("format" + format);

        throw new FormatException($"Invalid date format. Expected format: {format}");
    }


    public static bool BeValidDate(string time)
    {
        // Define an array of supported date formats
        string[] dateFormats = { "yyyy-MM-ddTHH:mm:ss.fffZ", "yyyy-MM-ddTHH:mm:ssZ", "MM/dd/yyyy", "dd/MM/yyyy", "yyyy/MM/dd" };
        // Try to parse the date using each format
        foreach (var format in dateFormats)
        {
            if (DateTime.TryParseExact(time, format, CultureInfo.InvariantCulture, DateTimeStyles.None, out var parsed))
            {
                // If parsing succeeds with any format, return true
                return true;
            }
        }

        // If parsing fails with all formats, return false
        return false;
    }

    public static bool IsFutureDate(string date)
    {
        string[] formats = { "yyyy-MM-ddTHH:mm:ss.fffZ", "yyyy-MM-ddTHH:mm:ssZ", "yyyy-MM-dd", "dd/MM/yyyy", "MM/dd/yyyy", "yyyy/MM/dd", };

        foreach (var format in formats)
        {
            if (DateTime.TryParseExact(date, format, CultureInfo.InvariantCulture, DateTimeStyles.AssumeUniversal, out var parsed))
            {
                Console.WriteLine(parsed >= DateTime.Now);
                return parsed >= DateTime.UtcNow;
            }
        }
        return false;
    }
}
