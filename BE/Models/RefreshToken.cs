using MongoDB.Bson;

namespace BE.Models;

public class RefreshToken {
    public ObjectId Id {get; set;}

    public ObjectId UserId {get; set;} 

    public string Token {get; set;} = null!;

    public string JwtId {get; set;} = null!;

    public bool IsUsed {get; set;}

    public bool IsRevoked { get; set; }

    public DateTime AddedDate { get; set; }

    public DateTime ExpiryDate { get; set; }
}