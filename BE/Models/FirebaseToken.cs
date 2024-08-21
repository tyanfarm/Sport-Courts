using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace BE.Models;

public class FirebaseToken {
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id {get; set;}

    [BsonRepresentation(BsonType.ObjectId)]
    public string UserId {get; set;} = null!;

    public string Token {get; set;} = null!;
}