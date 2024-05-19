using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace BE.Models;

public class Court {
    [BsonId]        // PK
    [BsonRepresentation(BsonType.ObjectId)]
    public string? CourtId {get; set;}

    [BsonElement("CourtName")]
    public string Name {get; set;} = null!;

    public string? Description {get; set;}

    [BsonRepresentation(BsonType.ObjectId)]
    [BsonElement("CatID")]
    public string? CatId {get; set;} = null!;

    public int Price {get; set;}

    public int Discount {get; set;}

    public string? Image {get; set;} = null!;

    public bool Active {get; set;}
}