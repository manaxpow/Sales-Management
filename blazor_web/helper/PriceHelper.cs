public static class PriceHelper
{

    public static string FormatPrice(decimal price)
    {
        return string.Format(new System.Globalization.CultureInfo("vi-VN"), "{0:N0} ₫", price);
    }
}
