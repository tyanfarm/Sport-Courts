namespace BE.DTOs;

public class ContentConversationDTO {
    public string? ContentId { get; set; }
    public string? ConversationId { get; set; }
    public string? Content { get; set; }
    public string? CustomerEmail { get; set; }  // Email instead of CustomerId
    public DateTime Time { get; set; }
}