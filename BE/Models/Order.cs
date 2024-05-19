using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace BE.Models;

public class Order {
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? OrderId {get; set;}

    [BsonRepresentation(BsonType.ObjectId)]
    [BsonElement("CustomerID")]
    public string? CustomerId {get; set;}

    public DateTime OrderDate {get; set;}

    [BsonRepresentation(BsonType.ObjectId)]
    [BsonElement("TransactStatusID")]
    public string? TransactStatusId {get; set;}

    public bool Paid {get; set;}

    public int TotalMoney {get; set;}
}