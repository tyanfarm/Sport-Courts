using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace BE.Models;

public class TransactStatus {
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? TransactStatusId {get; set;}

    public string? Status {get; set;}

    public string? Description {get; set;}
}