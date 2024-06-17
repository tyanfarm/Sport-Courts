using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace BE.Models;

public class Orderdetails {
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? OrderdetailsId {get; set;}
    
    [BsonRepresentation(BsonType.ObjectId)]
    [BsonElement("OrderID")]
    public string? OrderId {get; set;}

    [BsonRepresentation(BsonType.ObjectId)]
    [BsonElement("CourtID")]
    public string? CourtId {get; set;}

    public int TotalMoney {get; set;}

    public string? UsedDate {get; set;}

    public Court? Court {get; set;}
}