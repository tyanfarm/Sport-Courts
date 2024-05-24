using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace BE.Models;

public class RefreshToken {
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id {get; set;} = null!;

    [BsonRepresentation(BsonType.ObjectId)]
    public string UserId {get; set;} = null!;

    public string Token {get; set;} = null!;

    public string JwtId {get; set;} = null!;

    public bool IsUsed {get; set;}

    public bool IsRevoked { get; set; }

    public DateTime AddedDate { get; set; }

    public DateTime ExpiryDate { get; set; }
}