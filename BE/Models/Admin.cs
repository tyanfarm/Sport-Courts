using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace BE.Models;

public class Admin {
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? AdminId {get; set;}

    public string? Username {get; set;}

    public string? Password {get; set;}

    public string? Salt {get; set;}

    public bool Active {get; set;}

    public DateTime CreateDate {get; set;}
}