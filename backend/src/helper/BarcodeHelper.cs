using System.Text;

public static class BarcodeHelper
{
    public static string GenarateBarcode()
    {
        Random random = new Random();
        StringBuilder digits = new StringBuilder();
        digits.Append("89");
        // 7 số đầu (ngẫu nhiên)
        for (int i = 0; i < 5; i++)
            digits.Append(random.Next(0, 10));

        // Tính checksum
        int checksum = CalculateEANChecksum(digits.ToString());

        return digits.ToString() + checksum;
    }

    static int CalculateEANChecksum(string data)
    {
        int sum = 0;
        bool multiplyBy3 = true;

        // Tính từ phải sang trái
        for (int i = data.Length - 1; i >= 0; i--)
        {
            int digit = data[i] - '0';
            sum += digit * (multiplyBy3 ? 3 : 1);
            multiplyBy3 = !multiplyBy3;
        }

        int mod = sum % 10;
        return mod == 0 ? 0 : 10 - mod;
    }
}
