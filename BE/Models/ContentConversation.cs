using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace BE.Models;

public class ContentConversation {
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? ContentId {get; set;}

    [BsonRepresentation(BsonType.ObjectId)]
    [BsonElement("ConversationID")]
    public string? ConversationId {get; set;}

    public string? Content {get; set;}

    [BsonRepresentation(BsonType.ObjectId)]
    [BsonElement("UserID")]
    public string? CustomerId {get; set;}

    public DateTime Time {get; set;}
}